import dayjs from "dayjs";
import { Button, Descriptions, Drawer, Rate, Space } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";
import { useState } from "react";
import { callGetSubcontract, callGetSystem } from "../../../../services/api";

const ViewSystemMaintenanceService = (props) => {
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
    if (data?.maintenanceScope) {
      return [
        {
          label: "Dịch vụ",
          children:
            data?.serviceType === "ELECTRICAL"
              ? "Hệ thống Điện"
              : data?.serviceType === "PLUMBING"
              ? "Hệ thống Cấp thoát nước"
              : data?.serviceType === "FIRE_PROTECTION"
              ? "Hệ thống Điều hòa không khí"
              : data?.serviceType === "HVAC"
              ? "Hệ thống Phòng cháy"
              : "N/A",
          span: 2,
        },
        {
          label: "Phạm vi",
          children: data?.maintenanceScope || "N/A",
          span: 2,
        },
        {
          label: "Tần suất",
          children:
            data?.frequency === "MONTHLY"
              ? "Hàng tháng"
              : data?.frequency === "QUARTERLY"
              ? "Hàng quý"
              : data?.frequency === "ANNUALLY"
              ? "Hàng năm"
              : "N/A",
          span: 2,
        },
        {
          label: "Ngày dự kiến",
          children:
            dayjs(data?.nextScheduledDate).format("YYYY-MM-DD") || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children:
            (
              <span
                className={`${
                  data?.status === "COMPLETED"
                    ? "success"
                    : data?.status === "PENDING"
                    ? "danger"
                    : "warning"
                } status`}
              >
                {data?.status === "COMPLETED"
                  ? "Hoàn thành"
                  : data?.status === "PENDING"
                  ? "Chưa giải quyết"
                  : "Đang tiến hành"}
              </span>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Nhà thầu phụ",
          children: data?.subcontractor?.name ? (
            <a
              onClick={async () => {
                const res = await callGetSubcontract(data?.subcontractor?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.subcontractor?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
      ];
    } else if (data?.name) {
      return [
        { label: "Tên", children: data?.name || "N/A", span: 2 },
        { label: "Điện thoại", children: data?.phone || "N/A" },
        {
          label: "Rating",
          children: (
            <Rate value={data?.rating} disabled style={{ fontSize: 16 }} />
          ),
          span: 2,
        },
        {
          label: "Hệ thống",
          children: data?.system?.systemName ? (
            <a
              onClick={async () => {
                const res = await callGetSystem(data?.system?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.system?.systemName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
      ];
    } else {
      return [
        { label: "Tên", children: data?.systemName || "N/A", span: 2 },
        { label: "Mô tả", children: data?.description || "N/A", span: 2 },
        {
          label: "Chu kỳ bảo trì",
          children: data?.maintenanceCycle || "N/A",
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
        data?.maintenanceScope
          ? "Thông tin dịch vụ bảo trì hệ thống"
          : data?.name
          ? "Thông tin nhà thầu phụ"
          : "Thông tin hệ thống"
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

export default ViewSystemMaintenanceService;
