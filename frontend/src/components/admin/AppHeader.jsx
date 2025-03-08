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
} from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Header } from "antd/es/layout/layout";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import {
  callGetAccount,
  callGetAllNotifications,
  callGetChatRoomGroups,
  callGetChatRoomUsers,
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
  const [listMessages, setListMessages] = useState([]);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [listChatRoomUsers, setListChatRoomUsers] = useState([]);
  const [listChatRoomGroups, setListChatRoomGroups] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const sock = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
    const client = Stomp.over(sock);

    client.debug = () => {};

    client.connect({}, () => {
      setStompClient(client);

      const topics = [
        `/topic/user-status`,
        `/topic/repair-request-notifications/${user.id}`,
        `/topic/due-payment-notifications/${user.id}`,
        `/topic/work-registration-notifications/${user.id}`,
        `/topic/paymentNotifications/${user.id}`,
        `/topic/electricityUsageVerification/${user.id}`,
        `/topic/maintenance-task-notifications/${user.id}`,
        `/topic/messages/${user.id}`,
        `/topic/payment-notifications/${user.id}`,
        `/topic/birthday-notifications/${user.id}`,
        `/topic/repair-proposal-notifications/${user.id}`,
        `/topic/exp-payment-notifications/${user.id}`,

        `/topic/contract-customer-confirmation/${user.id}`,
      ];

      topics.forEach((topic) => {
        client.subscribe(topic, (messageOutput) => {
          const data = JSON.parse(messageOutput.body);

          fetchData();
          fetchNotifications();

          if (topic === `/topic/user-status`) {
            setUserStatus((prev) => ({ ...prev, ...data }));
          } else if (topic.includes(`/topic/messages/`)) {
            setListMessages((prev) => [...prev, data]);
            message.success("Bạn có một tin nhắn mới.");
          } else {
            setListNotifications((prev) => [...prev, data]);
            notification.success({
              message: "Thông báo",
              description: "Bạn có một thông báo mới. Vui lòng kiểm tra.",
            });
          }
        });
      });

      client.send(
        "/app/user-status",
        {},
        JSON.stringify({ userId: user.id, status: "online" })
      );

      const handleTabClose = () => {
        if (client.connected) {
          client.send(
            "/app/user-status",
            {},
            JSON.stringify({ userId: user.id, status: "offline" })
          );
          client.disconnect();
        }
      };

      window.addEventListener("beforeunload", handleTabClose);

      return () => {
        handleTabClose();
        window.removeEventListener("beforeunload", handleTabClose);
      };
    });
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
      navigate("/login");
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

  const fetchAllPages = async (apiCall, pageSize) => {
    let page = 1;
    let allResults = [];
    let hasMore = true;

    while (hasMore) {
      const query = `page=${page}&size=${pageSize}`;
      const response = await apiCall(query);
      const result = response?.data?.result || [];
      allResults = [...allResults, ...result];

      if (result.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    }
    return allResults;
  };

  const fetchNotifications = async () => {
    setLoading(true);

    const pageSize = 20;

    const res = await fetchAllPages(callGetAllNotifications, pageSize);

    setListNotifications(
      res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );

    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);

    const pageSize = 20;

    const allUsers = await fetchAllPages(callGetChatRoomUsers, pageSize);
    const allGroups = await fetchAllPages(callGetChatRoomGroups, pageSize);

    setListChatRoomUsers(allUsers);
    setListChatRoomGroups(allGroups);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    fetchData();
  }, []);

  const notificationMessages = {
    Contact: (msg) =>
      `Khách hàng có một khoản thanh toán với tổng số tiền ${msg?.paymentAmount}, hạn chót thanh toán vào ngày ${msg?.paymentDate}.`,
    Payment_Notification_Success: (msg) =>
      `Khách hàng vừa thanh toán thành công khoản tiền ${msg?.paymentAmount} vào ngày ${msg?.paymentDate}.`,
    Electricity_Usage_Verification: (msg) =>
      `Khách hàng vui lòng kiểm tra đồng hồ số ${msg?.meter?.serialNumber} đã được ghi chỉ số vào ngày ${msg?.readingDate}.`,
    Birthday_Notification: (msg) =>
      `Khách hàng ${msg?.directorName} của công ty ${msg?.companyName} sau 3 ngày nữa sẽ đến sinh nhật.`,
    Due_Payment_Notification: (msg) =>
      `Khoản thanh toán đến hạn, thời hạn cuối là ngày ${formatDate(
        msg?.dueDate
      )}.`,
    Exp_Payment_Notification: (msg) =>
      `Khoản thanh toán hết hạn, ${formatDate(msg?.dueDate)}.`,
    Maintenance_Task_Notification: (msg) =>
      `Bạn có sự cố bất thường cần kiểm tra vào ngày ${formatDate(
        msg?.maintenanceDate
      )}.`,
    Due_Contract_Notification: (msg) =>
      `Hợp đồng của khách hàng công ty ${msg?.customer?.companyName} sắp hết hạn.`,
    Repair_Proposal_Notification: (msg) =>
      `Bạn có báo giá và đề xuất bảo trì vào ngày ${formatDate(
        msg?.requestDate
      )}.`,
    Repair_Proposal_Notification_Verification: (msg) =>
      `Bạn có báo giá và đề xuất bảo trì vào ngày ${formatDate(
        msg?.requestDate
      )}.`,
    Repair_Request_Notification: (msg) =>
      `Bạn có yêu cầu sửa chữa vào ngày ${formatDate(msg?.requestDate)}.`,
    Repair_Request_Notification_Customer: (msg) =>
      `Yêu cầu sửa chữa của bạn đã ${
        msg?.status === "SUCCESS" ? "hoàn thành" : "thất bại"
      }, đơn yêu cầu của bạn vào ngày ${formatDate(msg?.requestDate)}.`,
    Repair_Request_Notification_Complete: (msg) =>
      `Yêu cầu sửa chữa được phân bổ nhiệm vụ cho kỹ thuật viên đã ${
        msg?.status === "SUCCESS" ? "hoàn thành" : "thất bại"
      }.`,
    Electricity_Usage_Customer: (msg) =>
      msg?.status === "NO"
        ? `Khách hàng không chấp nhận số điện đã ghi. Vui lòng kiểm tra lại và liên hệ để xác nhận.`
        : `Khách hàng đã đồng ý với số điện đã ghi. Vui lòng tiến hành tạo hóa đơn thanh toán.`,
    Work_Registration_Notification: (msg) =>
      `Bạn có yêu cầu đăng ký thi công vào ngày ${formatDate(
        msg?.registrationDate
      )}.`,
    Work_Register_Notification_Customer: (msg) =>
      `Yêu cầu đăng ký thi công của bạn vào ngày ${formatDate(
        msg?.registrationDate
      )}.`,
    Repair_Request_Notification_Technician: (msg) =>
      `Bạn có yêu cầu sửa chữa vào ngày ${formatDate(msg?.requestDate)}.`,
    Contract_Customer_Confirmation: (msg) =>
      `Khách hàng công ty ${msg?.contract?.customer?.companyName} vừa phản hồi về hợp đồng.`,
  };

  const notificationLabels = {
    Contact: "Thanh toán chờ xử lý",
    Payment_Notification_Success: "Thanh toán thành công",
    Electricity_Usage_Verification: "Chưa được xác nhận",
    Birthday_Notification: "Thông báo sinh nhật",
    Due_Payment_Notification: "Thông báo đến hạn thanh toán",
    Exp_Payment_Notification: "Thông báo hết hạn thanh toán",
    Maintenance_Task_Notification: "Thông báo nhiệm vụ sự cố bất thường",
    Due_Contract_Notification: "Thông báo hợp đồng sắp hết hạn",
    Repair_Proposal_Notification: "Thông báo đề xuất bảo trì",
    Repair_Request_Notification: "Thông báo yêu cầu sửa chữa",
    Repair_Request_Notification_Customer: "Thông báo yêu cầu sửa chữa",
    Repair_Request_Notification_Technician: "Thông báo yêu cầu sửa chữa",
    Repair_Request_Notification_Complete: "Thông báo yêu cầu sửa chữa",
    Electricity_Usage_Customer: "Thông báo ghi chỉ số điện",
    Work_Registration_Notification: "Thông báo đăng ký thi công",
    Work_Register_Notification_Customer: "Thông báo đăng ký thi công",
    Contract_Customer_Confirmation: "Thông báo phản hồi về hợp đồng",
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  const NotificationCard = ({ text, label, onClick, isRead }) => (
    <div
      onClick={onClick}
      className={`${
        isRead ? "text-gray-400" : "text-black"
      } hover:text-blue-500 transition duration-300 ease-in-out`}
    >
      <p className="font-bold">{label}</p>
      <p>{text.length > 40 ? text.substring(0, 40) + " ..." : text}</p>
    </div>
  );

  const notificationItems =
    listNotifications.length > 0
      ? listNotifications.map((notification) => {
          const message = notification?.message
            ? JSON.parse(notification?.message)
            : null;

          const notificationText =
            notificationMessages[notification?.recipient?.type]?.(message) ||
            "Thông báo không xác định";

          const label =
            notificationLabels[notification?.recipient?.type] ||
            "Thông báo không xác định";

          return {
            key: notification.id,
            label: (
              <NotificationCard
                text={notificationText}
                label={label}
                isRead={notification.status === "READ"}
                onClick={() => {
                  setNotificationDetails(notification);
                  handleReadNotification(notification?.id);
                  setOpenNotification(true);
                }}
              />
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
            onClick={() => {
              setOpenChat(true);
              fetchData();
            }}
            className="!shadow-none border-none p-0"
          >
            <Badge
              size="default"
              count={listChatRoomUsers.reduce(
                (sum, chatUser) => sum + chatUser.unreadCount,
                0
              )}
            >
              <TiMessages className="w-6 h-6 text-blue-950" />
            </Badge>
          </Button>

          <Dropdown
            menu={{
              items: notificationItems,
              className:
                "max-h-60 max-h-fit overflow-y-auto w-full h-[calc(100vh-25rem)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300",
            }}
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
                        ["Technician_Employee", "Technician_Manager"].includes(
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
      <ModalChat
        fetchData={fetchData}
        listChatRoomUsers={listChatRoomUsers}
        listChatRoomGroups={listChatRoomGroups}
        openChat={openChat}
        setOpenChat={setOpenChat}
        userStatus={userStatus}
      />
    </>
  );
};

export default AppHeader;
