import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";
import { Link } from "react-router-dom";

const ViewDevice = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const generateItems = () => {
    if (data?.deviceName) {
      return [
        {
          label: "Tên thiết bị",
          children: data?.deviceName || "N/A",
          span: 2,
        },
        {
          label: "Loại thiết bị",
          children: data?.deviceType?.typeName ? (
            <a
              onClick={() => {
                setData(data?.deviceType);
                setOpenViewDetail(true);
              }}
            >
              {data?.deviceType?.typeName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        { label: "Tuổi thọ", children: data?.lifespan || "N/A" },
        { label: "Ngày cài đặt", children: data?.installationDate || "N/A" },
        { label: "Vị trí", children: data?.location?.floor || "N/A" },
        {
          label: "Hệ thống",
          children: data?.system?.systemName ? (
            <a
              onClick={() => {
                setData(data?.system);
                setOpenViewDetail(true);
              }}
            >
              {data?.system?.systemName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Dịch vụ bảo trì",
          children: `${
            data?.maintenanceService?.subcontractor?.name || "N/A"
          } - ${
            data?.maintenanceService?.serviceType === "ELECTRICAL"
              ? "Hệ thống Điện"
              : data?.maintenanceService?.serviceType === "PLUMBING"
              ? "Hệ thống Cấp thoát nước"
              : data?.maintenanceService?.serviceType === "FIRE_PROTECTION"
              ? "Hệ thống Phòng cháy"
              : data?.maintenanceService?.serviceType === "HVAC"
              ? "Hệ thống Điều hòa không khí"
              : "N/A"
          }`,
          span: 2,
        },
      ];
    } else if (data?.typeName) {
      return [
        { label: "Tên", children: data?.typeName || "N/A", span: 2 },
        { label: "Mô tả", children: data?.description || "N/A", span: 2 },
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
        data?.deviceName
          ? "Thông tin thiết bị"
          : data?.typeName
          ? "Thông tin loại thiết bị"
          : "Thông tin hệ thống"
      }`}
      onClose={() => setOpenViewDetail(false)}
      open={openViewDetail}
      width={window.innerWidth > 900 ? 800 : window.innerWidth}
    >
      <Descriptions
        items={items}
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        bordered
      />
    </Drawer>
  );
};

export default ViewDevice;
