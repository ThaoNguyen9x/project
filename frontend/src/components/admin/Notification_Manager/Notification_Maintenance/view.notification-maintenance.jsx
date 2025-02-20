import dayjs from "dayjs";
import { Button, Descriptions, Drawer, Space } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";
import { useState } from "react";
import { callGetTask } from "../../../../services/api";

const ViewNotificationMaintenance = (props) => {
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

  const commonItems = [
    {
      label: "Ngày tạo",
      children:
        dayjs(data?.createdAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      span: 2,
    },
    {
      label: "Ngày cập nhật",
      children:
        dayjs(data?.updatedAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      span: 2,
    },
    {
      label: "Tạo bởi",
      children: data?.createdBy || "N/A",
      span: 2,
    },
    {
      label: "Cập nhật bởi",
      children: data?.updatedBy || "N/A",
      span: 2,
    },
  ];

  const specificItems = data?.title
    ? [
        {
          label: "Tiêu đề",
          children: data?.title || "N/A",
          span: 2,
        },
        {
          label: "Tin nhắn",
          children: data?.description || "N/A",
          span: 2,
        },
        {
          label: "Ngày bảo trì",
          children:
            dayjs(data?.maintenanceDate).format(FORMAT_DATE_TIME_DISPLAY) ||
            "N/A",
          span: 2,
        },
        {
          label: "Nhiệm vụ bảo trì",
          children: data?.maintenanceTask?.taskName ? (
            <a
              onClick={async () => {
                const res = await callGetTask(data?.maintenanceTask.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.maintenanceTask?.taskName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
      ]
    : [
        {
          label: "Nhiệm vụ bảo trì",
          children: data?.taskName || "N/A",
          span: 2,
        },
        {
          label: "Mô tả",
          children: data?.taskDescription || "N/A",
          span: 2,
        },
        {
          label: "Loại bảo trì",
          children:
            (
              <span
                className={`${
                  data?.maintenanceType == "SCHEDULED" ? "success" : "warning"
                } status`}
              >
                {data?.maintenanceType == "SCHEDULED"
                  ? "Bảo trì định kỳ"
                  : "Bảo trì sự cố đột xuất"}
              </span>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Người thực hiện bảo trì",
          children: data?.assignedTo || "N/A",
          span: 2,
        },
        {
          label: "Số điện thoại người thực hiện bảo trì",
          children: data?.assignedToPhone || "N/A",
          span: 2,
        },
        {
          label: "Thời gian dự kiến hoàn thành",
          children: data?.expectedDuration || "N/A",
          span: 2,
        },
      ];

  const items =
    user?.role?.name === "Application_Admin"
      ? [...specificItems, ...commonItems]
      : [...specificItems];

  return (
    <Drawer
      title={`${
        data?.title
          ? "Thông tin sự cố bất thường"
          : "Thông tin nhiệm vụ bảo trì"
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

export default ViewNotificationMaintenance;
