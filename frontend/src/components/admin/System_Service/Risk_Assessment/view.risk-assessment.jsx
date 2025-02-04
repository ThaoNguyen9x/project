import dayjs from "dayjs";
import { Descriptions, Drawer, Rate } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../../utils/constant";

const ViewRiskAssessment = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const generateItems = () => {
    if (data?.assessmentDate) {
      return [
        {
          label: "Lịch sử bảo trì",
          children: data?.contractor?.name ? (
            <a
              onClick={() => {
                setData(data?.maintenanceHistory);
                setOpenViewDetail(true);
              }}
            >
              {`${data?.maintenanceHistory?.technician?.name} - ${data?.maintenanceHistory?.performedDate}`}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Nhà thầu phụ",
          children: data?.contractor?.name ? (
            <a
              onClick={() => {
                setData(data?.contractor);
                setOpenViewDetail(true);
              }}
            >
              {data?.contractor?.name}
            </a>
          ) : (
            "N/A"
          ),
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
          label: "Xác xuất rủi ro",
          children: data?.riskProbability || "N/A",
          span: 2,
        },
        {
          label: "Tác động rủi ro",
          children: data?.riskImpact || "N/A",
          span: 2,
        },
        {
          label: "Phát hiện rủi ro",
          children: data?.riskDetection || "N/A",
          span: 2,
        },
        {
          label: "Số ưu tiên rủi ro",
          children: data?.riskPriorityNumber || "N/A",
          span: 2,
        },
        {
          label: "Hành động giảm thiểu",
          children: data?.mitigationAction || "N/A",
          span: 2,
        },
        {
          label: "Nhận xét",
          children: data?.remarks || "N/A",
          span: 2,
        },
        {
          label: "Ngày đánh giá",
          children:
            dayjs(data?.assessmentDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
      ];
    } else if (data?.performedDate) {
      return [
        {
          label: "Dịch vụ bảo trì",
          children: data?.maintenanceService?.subcontractor?.name ? (
            <a
              onClick={() => {
                setData(data?.maintenanceService?.subcontractor);
                setOpenViewDetail(true);
              }}
            >
              {`${data?.maintenanceService?.subcontractor?.name} - ` +
                (data?.maintenanceService?.serviceType === "ELECTRICAL"
                  ? "Hệ thống điện"
                  : data?.maintenanceService?.serviceType === "PLUMBING"
                  ? "Hệ thống cấp thoát nước"
                  : data?.maintenanceService?.serviceType === "HVAC"
                  ? "Hệ thống điều hòa không khí"
                  : "Hệ thống phòng cháy") || "N/A"}
            </a>
          ) : (
            "N/A"
          ),
        },
        {
          label: "Ghi chú",
          children: data?.notes || "N/A",
          span: 2,
        },
        {
          label: "Vấn đề",
          children: data?.findings || "N/A",
          span: 2,
        },
        {
          label: "Giải pháp",
          children: data?.resolution || "N/A",
          span: 2,
        },
        {
          label: "Kỹ thuật viên",
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
          label: "Số điện thoại khác",
          children: data?.phone || "N/A",
          span: 2,
        },
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
        data?.assessmentDate
          ? "Thông tin đánh giá rủi ro"
          : data?.performedDate
          ? "Thông tin lịch sử bảo trì"
          : data?.email
          ? "Thông tin kỹ thuật viên"
          : data?.name
          ? "Thông tin nhà thầu phụ"
          : data?.deviceName
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

export default ViewRiskAssessment;
