import dayjs from "dayjs";
import { Button, Descriptions, Drawer, Space } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../utils/constant";
import { callGetUser } from "../../../services/api";
import { useState } from "react";

const ViewWorkRegistration = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;
  const [historyStack, setHistoryStack] = useState([]);

  const onClose = () => {
    setOpenViewDetail(false);
    setData(null);
    setHistoryStack([]);
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prevData = historyStack[historyStack.length - 1];
      setHistoryStack(historyStack.slice(0, -1));
      setData(prevData);
    }
  };

  const handleViewDetail = async (newData) => {
    setHistoryStack([...historyStack, data]);
    setData(newData);
    setOpenViewDetail(true);
  };

  const generateItems = () => {
    if (data?.email) {
      return [
        { label: "Họ và tên", children: data?.name || "N/A", span: 2 },
        { label: "Email", children: data?.email || "N/A", span: 2 },
        { label: "Điện thoại", children: data?.mobile || "N/A" },
        { label: "Vai trò", children: data?.role?.name || "N/A" },
        {
          label: "Trạng thái",
          span: 2,
          children:
            (
              <span className={`${data?.status ? "success" : "danger"} status`}>
                {data?.status ? "Hoạt động" : "Không hoạt động"}
              </span>
            ) || "N/A",
        },
      ];
    } else {
      return [
        {
          label: "Ngày đăng ký",
          children:
            dayjs(data?.registrationDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Người yêu cầu",
          children: data?.account?.name ? (
            <a
              onClick={async () => {
                const res = await callGetUser(data?.account?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.account?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Ngày dự kiến",
          children:
            dayjs(data?.scheduledDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Nội dung",
          children: data?.note,
          span: 2,
        },
        {
          label: "Bản vẽ",
          children:
            (
              <a
                href={`${
                  import.meta.env.VITE_BACKEND_URL
                }/storage/work_registrations/${data?.drawingUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem
              </a>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children: (
            <span
              className={`status ${
                data?.status === "PENDING"
                  ? "warning"
                  : data?.status === "REJECTED"
                  ? "danger"
                  : data?.status === "COMPLETED"
                  ? "success"
                  : "success"
              }`}
            >
              {data?.status === "PENDING"
                ? "Đang chờ xử lý"
                : data?.status === "APPROVED"
                ? "Đã chấp nhận"
                : data?.status === "COMPLETED"
                ? "Đã hoàn thành"
                : "Đã từ chối"}
            </span>
          ),
          span: 2,
        },
      ];
    }
  };

  let items = generateItems();

  if (user?.role?.name === "Application_Admin") {
    items = [
      ...items,
      {
        label: "Ngày tạo",
        span: 2,
        children:
          dayjs(data?.createdAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      },
      {
        label: "Ngày cập nhật",
        span: 2,
        children:
          dayjs(data?.updatedAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      },
      {
        label: "Tạo bởi",
        span: 2,
        children: data?.createdBy || "N/A",
      },
      {
        label: "Cập nhật bởi",
        span: 2,
        children: data?.updatedBy || "N/A",
      },
    ];
  }

  return (
    <Drawer
      title={`${
        data?.registrationDate
          ? "Thông tin đăng ký thi công"
          : "Thông tin liên hệ"
      }`}
      onClose={onClose}
      open={openViewDetail}
      width={window.innerWidth > 900 ? 800 : window.innerWidth}
      extra={
        <Space>
          {historyStack.length > 0 && (
            <Button onClick={goBack}>Quay lại</Button>
          )}
        </Space>
      }
    >
      <Descriptions
        items={items}
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        bordered
      />
    </Drawer>
  );
};

export default ViewWorkRegistration;
