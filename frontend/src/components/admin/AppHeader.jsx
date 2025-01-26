import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  message,
  notification,
  Space,
  Spin,
} from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Header } from "antd/es/layout/layout";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import {
  callGetAllNotificationMaintenances,
  callGetAllNotifications,
  callLogout,
  callReadNotification,
  callReadNotificationMaintenance,
} from "../../services/api";
import { AuthContext } from "../share/Context";
import ModalProfile from "./modal.profile";
import ModalNotification from "./modal.notification";
import { TiMessages } from "react-icons/ti";
import ModalChat from "./modal.chat";

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [openProfile, setOpenProfile] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [listNotifications, setListNotifications] = useState([]);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sock = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
    const stompClient = Stomp.over(sock);

    stompClient.debug = () => {};

    const topics = [
      `/topic/paymentNotifications/${user.id}`,
      `/topic/electricityUsageVerification/${user.id}`,
      `/topic/maintenance/${user.id}`,
      `/topic/admin/work-registrations/${user.id}`,
    ];

    stompClient.connect(
      {},
      () => {
        topics.forEach((topic) => {
          stompClient.subscribe(topic, (messageOutput) => {
            const newMessage = JSON.parse(messageOutput.body);
            fetchNotifications();

            setListNotifications((prevMessages) => [
              ...prevMessages,
              { ...newMessage },
            ]);

            notification.success({
              message: "Thông báo",
              description: "Bạn có một thông báo mới. Vui lòng kiểm tra.",
            });
          });
        });
      },
      (err) => {
        notification.error({
          message: "Có lỗi xảy ra",
          description: "Kết nối thất bại",
        });
        console.error("WebSocket Error:", err);
      }
    );

    return () => stompClient.disconnect();
  }, [user.id]);

  // Handle logout
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.statusCode === 200) {
      localStorage.removeItem("access_token");
      setUser({
        id: "",
        name: "",
        email: "",
        mobile: "",
        role: "",
      });
      message.success(res.message);
      navigate("/");
    }
  };

  const itemSetting = [
    {
      key: "1",
      label: (
        <div
          onClick={() => setOpenProfile(true)}
          className="flex items-center gap-2 py-1"
        >
          <IoSettingsOutline className="h-5 w-5" />
          Tài khoản
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => handleLogout()}
          className="flex items-center gap-2 py-1"
        >
          <IoIosLogOut className="h-5 w-5" />
          Đăng xuất
        </div>
      ),
    },
  ];

  const fetchNotifications = async () => {
    setLoading(true);

    const [res1, res2] = await Promise.all([
      callGetAllNotifications(),
      callGetAllNotificationMaintenances(),
    ]);

    const allResults = [...res1.data.result, ...res2.data.result];

    setListNotifications(
      allResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );

    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const notificationItems =
    listNotifications?.filter(
      (notification) =>
        notification?.recipient?.referenceId === user?.id ||
        ["ENGINEERING", "TECHNICAL_MANAGER"].includes(user?.role?.name)
    ).length > 0
      ? listNotifications.map((notification, index) => {
          const message = notification?.message
            ? JSON.parse(notification?.message)
            : null;

          const formattedDate = message?.paymentDate
            ? new Date(message?.paymentDate).toLocaleDateString()
            : "N/A";

          const formattedAmount = message?.paymentAmount
            ? message?.paymentAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            : "N/A";

          const notificationText =
            message?.paymentStatus === "UNPAID"
              ? `Khách hàng có khoản thanh toán ${formattedAmount} hạn chót thanh toán vào ${formattedDate}.`
              : message?.paymentStatus === "PAID"
              ? `Khách hàng vừa thanh toán thành công khoản tiền ${formattedAmount} vào ngày ${formattedDate}.`
              : message?.status === "UNACTIV"
              ? `Khách hàng vui lòng kiểm tra đồng hồ số ${message?.meter?.serialNumber} đã được ghi chỉ số vào ngày ${message?.readingDate}.`
              : ``;

          return {
            key: index,
            label: (
              <div
                key={index}
                onClick={() => {
                  setNotificationDetails(notification);
                  handleReadNotification(notification?.id);
                  setOpenNotification(true);
                }}
                className={`${
                  notification.status === "READ"
                    ? "text-gray-400"
                    : "text-black"
                }`}
              >
                <p className="font-bold">
                  {message?.paymentStatus === "UNPAID"
                    ? "Thanh toán chờ xử lý"
                    : message?.paymentStatus === "PAID"
                    ? "Thanh toán thành công"
                    : message?.status === "UNACTIV"
                    ? "Chưa được xác nhận"
                    : message?.status === "ACTIV"
                    ? "Đã được xác nhận"
                    : notification?.title}
                </p>
                {notificationText.substring(0, 50) + " ..."}
              </div>
            ),
          };
        })
      : [{ key: "0", label: <p>Không có thông báo.</p> }];

  const handleReadNotification = async (id) => {
    const [res1, res2] = await Promise.all([
      callReadNotification(id),
      callReadNotificationMaintenance(id),
    ]);

    const allResults = [
      res1?.statusCode === 200 ? res1.data : null,
      res2?.statusCode === 200 ? res2.data : null,
    ].filter(Boolean);

    if (allResults.length > 0) {
      fetchNotifications(allResults);
    }
  };

  return (
    <>
      <Header className="flex items-center justify-between gap-3 xl:gap-5 bg-white px-4 shadow-md">
        <div>
          <Input
            placeholder="Search here..."
            className="focus:shadow-none focus:border-red-700 hover:border-red-700"
          />
        </div>
        <div className="flex items-center gap-3 xl:gap-5">
          <Button
            className="!shadow-none border-none p-0"
            onClick={() => {
              setOpenChat(true);
            }}
          >
            <Badge size="default" count={1}>
              <TiMessages className="w-6 h-6 text-blue-950" />
            </Badge>
          </Button>

          <Dropdown
            menu={{ items: notificationItems }}
            trigger={["click"]}
            placement="bottomLeft"
            arrow
          >
            <Button className="!shadow-none border-none p-0">
              <Badge
                size="default"
                count={
                  listNotifications.filter(
                    (notification) =>
                      (notification?.status === "PENDING" &&
                        notification?.recipient?.referenceId === user?.id) ||
                      (notification?.status === "PENDING" &&
                        ["ENGINEERING", "TECHNICAL_MANAGER"].includes(
                          user?.role?.name
                        ))
                  ).length
                }
              >
                <FaRegBell className="w-6 h-6 text-blue-950" />
              </Badge>
            </Button>
          </Dropdown>

          <Space direction="vertical">
            <Dropdown
              menu={{
                items: itemSetting,
              }}
              trigger={["click"]}
              placement="bottomLeft"
              arrow
            >
              <Button className="!shadow-none border-none p-0">
                <Avatar size={32} shape="square" className="bg-red-700">
                  {user?.role?.name[0]?.toUpperCase()}
                </Avatar>
                <h2 className="font-medium text-blue-950 hidden lg:block">
                  {user?.name}
                </h2>
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Header>

      {/* Profile Modal */}
      <ModalProfile openProfile={openProfile} setOpenProfile={setOpenProfile} />

      {/* Notification Modal */}
      <ModalNotification
        openNotification={openNotification}
        setOpenNotification={setOpenNotification}
        notificationDetails={notificationDetails}
      />

      {/* Chat Modal */}
      <ModalChat openChat={openChat} setOpenChat={setOpenChat} />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}
    </>
  );
};

export default AppHeader;
