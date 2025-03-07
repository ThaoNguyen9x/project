import dayjs from "dayjs";
import { Descriptions, Drawer, Space, Button } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../utils/constant";
import { useState } from "react";
import { callGetUser } from "../../../services/api";

const ViewRepairRequest = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;
  const [historyStack, setHistoryStack] = useState([]);

  const onClose = () => {
    setOpenViewDetail(false);
    setHistoryStack([]);
    setData(null);
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
        { label: "Họ và tên", children: data?.name || "N/A" },
        { label: "Email", children: data?.email || "N/A" },
        { label: "Điện thoại", children: data?.mobile || "N/A" },
        { label: "Vai trò", children: data?.role?.name || "N/A" },
        {
          label: "Trạng thái",
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
          label: "Ngày yêu cầu",
          children:
            dayjs(data?.requestDate).format(FORMAT_DATE_DISPLAY) || "N/A",
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
              {data?.account?.name} - {data?.account?.customer?.companyName}
            </a>
          ) : (
            "N/A"
          ),
        },
        {
          label: "Nội dung",
          children: data?.content,
        },
        {
          label: "Hình ảnh",
          children:
            (
              <a
                href={`${
                  import.meta.env.VITE_BACKEND_URL
                }/storage/repair_requests/${data?.imageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem
              </a>
            ) || "N/A",
        },
        {
          label: "Kỷ thuật viên phụ trách",
          children: data?.technician?.name ? (
            <a
              onClick={async () => {
                const res = await callGetUser(data?.technician?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.technician?.name}
            </a>
          ) : (
            "Chưa được điều động"
          ),
        },
        {
          label: "Trạng thái",
          children: (
            <span
              className={`status ${
                data?.status === "PENDING"
                  ? "warning"
                  : data?.status === "FAILED"
                  ? "danger"
                  : "success"
              }`}
            >
              {data?.status === "PENDING"
                ? "Đang chờ xử lý"
                : data?.status === "FAILED"
                ? "Đã thất bại"
                : "Đã hoàn thành"}
            </span>
          ),
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
        children:
          dayjs(data?.createdAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      },
      {
        label: "Ngày cập nhật",
        children:
          dayjs(data?.updatedAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      },
      {
        label: "Tạo bởi",
        children: data?.createdBy || "N/A",
      },
      {
        label: "Cập nhật bởi",
        children: data?.updatedBy || "N/A",
      },
    ];
  }

  return (
    <Drawer
      title={`${
        data?.requestDate
          ? "Thông tin yêu cầu sửa chữa"
          : "Thông tin người dùng"
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
      <Descriptions items={items} column={1} bordered />
    </Drawer>
  );
};

export default ViewRepairRequest;
