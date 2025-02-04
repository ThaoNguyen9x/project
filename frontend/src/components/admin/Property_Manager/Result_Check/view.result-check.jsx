import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../../utils/constant";

const ViewResultCheck = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const generateItems = () => {
    if (data?.note) {
      return [
        {
          label: "Tên mục kiểm tra",
          children: data?.itemCheck?.checkName ? (
            <a
              onClick={() => {
                setData(data?.itemCheck);
                setOpenViewDetail(true);
              }}
            >
              {data?.itemCheck?.checkName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Ghi chú",
          children: data?.note || "N/A",
          span: 2,
        },
        {
          label: "Nhân viên phụ trách",
          children: data?.technician?.name ? (
            <a
              onClick={() => {
                setData(data?.technician);
                setOpenViewDetail(true);
              }}
            >
              {data?.technician?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Kết quả",
          children:
            data?.frequency === "ĐẠT"
              ? "Đạt"
              : data?.frequency === "KHÔNG_ĐẠT"
              ? "Không đạt"
              : data?.frequency === "CẦN_SỬA_CHỮA"
              ? "Cần sửa chữa"
              : "N/A",
          span: 2,
        },
        {
          label: "Thời gian kiểm tra",
          children: dayjs(data?.checkedAt).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
      ];
    } else if (data?.checkName) {
      return [
        {
          label: "Tên mục kiểm tra",
          children: data?.checkName || "N/A",
          span: 2,
        },
        {
          label: "Danh mục kiểm tra",
          children: data?.checkCategory || "N/A",
          span: 2,
        },
        {
          label: "Tiêu chuẩn kiểm tra",
          children: data?.standard || "N/A",
          span: 2,
        },
        {
          label: "Thiết bị",
          children: data?.device?.deviceName ? (
            <a
              onClick={() => {
                setData(data?.device);
                setOpenViewDetail(true);
              }}
            >
              {data?.device?.deviceName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Tần suất",
          children:
            data?.frequency === "HÀNG_NGÀY"
              ? "Hàng ngày"
              : data?.frequency === "HÀNG_TUẦN"
              ? "Hàng tuần"
              : data?.frequency === "HÀNG_THÁNG"
              ? "Hàng tháng"
              : data?.frequency === "HÀNG_QUÝ"
              ? "Hàng quý"
              : data?.frequency === "HÀNG_NĂM"
              ? "Hàng năm"
              : "N/A",
          span: 2,
        },
      ];
    } else if (data?.deviceName) {
      return [
        { label: "Tên thiết bị", children: data?.deviceName || "N/A", span: 2 },
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
    } else if (data?.email) {
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
        data?.note
          ? "Thông tin kết quả kiểm tra mục"
          : data?.checkName
          ? "Thông tin kiểm tra mục"
          : data?.deviceName
          ? "Thông tin thiết bị"
          : data?.typeName
          ? "Thông tin loại thiết bị"
          : data?.email
          ? "Thông tin nhân viên phụ trách"
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

export default ViewResultCheck;
