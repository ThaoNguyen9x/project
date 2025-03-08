import dayjs from "dayjs";
import { Descriptions, Drawer, Rate, Space, Button } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../../utils/constant";
import { useState } from "react";
import {
  callGetCommonArea,
  callGetContract,
  callGetCustomer,
  callGetDevice,
  callGetDeviceType,
  callGetMaintenanceHistory,
  callGetOffice,
  callGetRiskAssessment,
  callGetSubcontract,
  callGetSystem,
  callGetSystemMaintenanceService,
  callGetUser,
  callGetCustomerType,
} from "../../../../services/api";

const ViewMaintenanceHistory = (props) => {
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
    if (data?.deviceId) {
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
              onClick={async () => {
                const res = await callGetDeviceType(data?.deviceType?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
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
        { label: "Tọa độ X", children: data?.x || 0 },
        { label: "Tọa độ Y", children: data?.y || 0 },
        {
          label: "Dịch vụ bảo trì",
          children: (
            <>
              {data?.maintenanceService?.serviceType ? (
                <a
                  onClick={async () => {
                    const res = await callGetSystemMaintenanceService(
                      data?.maintenanceService?.id
                    );
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  {data?.maintenanceService?.serviceType === "ELECTRICAL"
                    ? "Hệ thống điện"
                    : data?.maintenanceService?.serviceType === "PLUMBING"
                    ? "Hệ thống cấp thoát nước"
                    : data?.maintenanceService?.serviceType === "HVAC"
                    ? "Hệ thống điều hòa không khí"
                    : "Hệ thống phòng cháy"}
                </a>
              ) : (
                "N/A"
              )}
            </>
          ),
          span: 2,
        },
        {
          label: "Đánh giá rủi ro",
          children:
            data?.riskAssessments?.length > 0 ? (
              data?.riskAssessments?.map((x) => (
                <a
                  key={x?.riskAssessmentID}
                  onClick={async () => {
                    const res = await callGetRiskAssessment(
                      x?.riskAssessmentID
                    );
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  {x?.assessmentDate} <br />
                </a>
              ))
            ) : (
              <span>Chưa có đánh giá</span>
            ),
          span: 2,
        },
      ];
    } else if (data?.description) {
      return [
        { label: "Tên", children: data?.typeName || "N/A", span: 2 },
        {
          label: "Mô tả",
          children: data?.description || "N/A",
          span: 2,
        },
      ];
    } else if (data?.systemName) {
      return [
        { label: "Tên", children: data?.systemName || "N/A", span: 2 },
        { label: "Mô tả", children: data?.description || "N/A", span: 2 },
        {
          label: "Chu kỳ bảo trì",
          children: data?.maintenanceCycle || "N/A",
          span: 2,
        },
      ];
    } else if (data?.fileName) {
      return [
        {
          label: "Khách hàng",
          children: data?.customer?.companyName ? (
            <a
              onClick={async () => {
                const res = await callGetCustomer(data?.customer?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.customer?.companyName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Tổng số tiền",
          children: data?.totalAmount
            ? data?.totalAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : 0,
          span: 2,
        },
        {
          label: "Ngày bắt đầu",
          children: dayjs(data?.startDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Ngày kết thúc",
          children: dayjs(data?.endDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Tình trạng hợp đồng",
          children: (
            <span
              className={`${
                data?.leaseStatus === "Active"
                  ? "success"
                  : data?.leaseStatus === "Inactive"
                  ? "danger"
                  : data?.leaseStatus === "Wait"
                  ? "warning"
                  : data?.leaseStatus === "Pending"
                  ? "bg-gray-200"
                  : data?.leaseStatus === "Corrected"
                  ? "bg-gray-200"
                  : data?.leaseStatus === "W_Confirmation"
                  ? "bg-red-500 text-white"
                  : data?.leaseStatus === "Send"
                  ? "bg-green-500 text-white"
                  : data?.leaseStatus === "W_Confirmation_2"
                  ? "bg-red-500 text-white"
                  : data?.leaseStatus === "Rejected"
                  ? "bg-red-700 text-white"
                  : data?.leaseStatus === "Approved"
                  ? "bg-blue-950 text-white"
                  : ""
              } status`}
            >
              {data?.leaseStatus === "Active"
                ? "Hoạt động"
                : data?.leaseStatus === "Inactive"
                ? "Đã chấm dứt"
                : data?.leaseStatus === "Wait"
                ? "Đang chờ gia hạn"
                : data?.leaseStatus === "Pending"
                ? "Đang chờ xử lý"
                : data?.leaseStatus === "Corrected"
                ? "Đã sửa"
                : data?.leaseStatus === "Send"
                ? "Đã gửi hợp đồng"
                : data?.leaseStatus === "W_Confirmation"
                ? "Đang chờ xác nhận"
                : data?.leaseStatus === "W_Confirmation_2"
                ? "Đang chờ xác nhận lần 2"
                : data?.leaseStatus === "Rejected"
                ? "Từ chối"
                : data?.leaseStatus === "Approved"
                ? "Chấp nhận"
                : ""}
            </span>
          ),
        },
      ];
    } else if (data?.role?.name) {
      return [
        { label: "Tên", children: data?.name || "N/A", span: 2 },
        { label: "Email", children: data?.email || "N/A", span: 2 },
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
          span: 2,
        },
      ];
    } else if (data?.typeName) {
      return [
        { label: "Tên", children: data?.typeName || "N/A", span: 2 },
        {
          label: "Hồ sơ",
          children:
            data?.customerTypeDocuments?.map((x) => (
              <p key={x?.id}>{x?.documentType}</p>
            )) || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children:
            (
              <span className={`${data?.status ? "success" : "danger"} status`}>
                {data?.status ? "Hoạt động" : "Không hoạt động"}
              </span>
            ) || "N/A",
          span: 2,
        },
      ];
    } else if (data?.assessmentDate) {
      return [
        {
          label: "Lịch sử bảo trì",
          children: data?.maintenanceHistory?.performedDate ? (
            <a
              onClick={async () => {
                const res = await callGetMaintenanceHistory(
                  data?.maintenanceHistory?.id
                );
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.maintenanceHistory?.performedDate || "N/A"}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Tên thiết bị",
          children: data?.device?.deviceName ? (
            <a
              onClick={async () => {
                const res = await callGetDevice(data?.device?.deviceId);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
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
          label: "Nhà thầu phụ",
          children: data?.contractor?.name ? (
            <a
              onClick={async () => {
                const res = await callGetSubcontract(data?.contractor?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
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
          children: data?.maintenanceService?.serviceType ? (
            <a
              onClick={async () => {
                const res = await callGetSystemMaintenanceService(
                  data?.maintenanceService?.id
                );
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.maintenanceService?.serviceType === "ELECTRICAL"
                ? "Hệ thống Điện"
                : data?.maintenanceService?.serviceType === "PLUMBING"
                ? "Hệ thống Cấp thoát nước"
                : data?.maintenanceService?.serviceType === "HVAC"
                ? "Hệ thống Điều hòa không khí"
                : "Hệ thống Phòng cháy" || "N/A"}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
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
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Số điện thoại khác",
          children: data?.phone || "Không có",
          span: 2,
        },
      ];
    } else if (data?.rentPrice) {
      return [
        { label: "Tên", children: data?.name || "N/A", span: 2 },
        {
          label: "Hợp đồng",
          children: (
            <>
              {data?.contracts?.[0]?.customer?.companyName ? (
                <a
                  onClick={async () => {
                    const res = await callGetContract(data?.contracts?.[0]?.id);
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  Công ty - {data?.contracts?.[0]?.customer?.companyName}
                </a>
              ) : (
                "N/A"
              )}
            </>
          ),
          span: 2,
        },
        {
          label: "Tổng diện tích",
          children: data?.totalArea + " m²" || "N/A",
          span: 2,
        },
        {
          label: "Giá thuê",
          children:
            data?.rentPrice?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }) || "N/A",
          span: 2,
        },
        {
          label: "Phí dịch vụ",
          children:
            data?.serviceFee?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }) || "N/A",
          span: 2,
        },
        { label: "Tọa độ bắt đầu x", children: data?.startX || 0 },
        { label: "Tọa độ bắt đầu y", children: data?.startY || 0 },
        { label: "Tọa độ kết thúc x", children: data?.endX || 0 },
        { label: "Tọa độ kết thúc y", children: data?.endY || 0 },
        {
          label: "Bản vẽ",
          children:
            (
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/storage/offices/${
                  data?.drawingFile
                }`}
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
          children:
            (
              <span
                className={`${
                  data?.status === "ACTIV" ? "success" : "danger"
                } status`}
              >
                {data?.status === "ACTIV" ? "Hoạt động" : "Không hoạt động"}
              </span>
            ) || "N/A",
          span: 2,
        },
      ];
    } else if (data?.contractEndDate) {
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
          children: data?.system?.systemName || "N/A",
          span: 2,
        },
        { label: "Ngày bắt đầu", children: data?.contractStartDate || "N/A" },
        { label: "Ngày kết thúc", children: data?.contractEndDate || "N/A" },
      ];
    } else if (data?.companyName) {
      return [
        { label: "Công ty", children: data?.companyName || "N/A", span: 2 },
        { label: "Giám đốc", children: data?.directorName || "N/A", span: 2 },
        { label: "Email", children: data?.email || "N/A" },
        { label: "Điện thoại", children: data?.phone || "N/A" },
        { label: "Địa chỉ", children: data?.address || "N/A", span: 2 },
        {
          label: "Ngày sinh",
          children: data?.birthday
            ? dayjs(data?.birthday).format("YYYY-DD-MM")
            : "N/A",
          span: 2,
        },
        {
          label: "Liên hệ",
          children: data?.user?.name ? (
            <a
              onClick={async () => {
                const res = await callGetUser(data?.user?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.user?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Loại khách hàng",
          children: data?.customerType?.typeName ? (
            <a
              onClick={async () => {
                const res = await callGetCustomerType(data?.customerType?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.customerType?.typeName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
      ];
    } else if (data?.nextScheduledDate) {
      return [
        {
          label: "Dịch vụ",
          children:
            data?.serviceType === "ELECTRICAL"
              ? "Hệ thống Điện"
              : data?.serviceType === "PLUMBING"
              ? "Hệ thống Cấp thoát nước"
              : data?.serviceType === "FIRE_PROTECTION"
              ? "Hệ thống Phòng cháy"
              : data?.serviceType === "HVAC"
              ? "Hệ thống Điều hòa không khí"
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
    } else {
      return [
        { label: "Tên", children: data?.name || "N/A", span: 2 },
        { label: "Tọa độ bắt đầu X", children: data?.startX || 0, span: 2 },
        {
          label: "Tọa độ bắt đầu Y",
          children: data?.startY || 0,
          span: 2,
        },
        { label: "Tọa độ kết thúc X", children: data?.endX || 0, span: 2 },
        { label: "Tọa độ kết thúc Y", children: data?.endY || 0, span: 2 },
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
        data?.floor
          ? "Thông tin vị trí"
          : data?.description
          ? "Thông tin loại thiết bị"
          : data?.systemName
          ? "Thông tin hệ thống"
          : data?.contractEndDate
          ? "Thông tin nhà thầu phụ"
          : data?.fileName
          ? "Thông tin hợp đồng"
          : data?.companyName
          ? "Thông tin khách hàng"
          : data?.typeName
          ? "Thông tin loại khách hàng"
          : data?.role?.name
          ? "Thông tin liên hệ"
          : data?.assessmentDate
          ? "Thông tin đánh giá rủi ro"
          : data?.performedDate
          ? "Thông tin lịch sử bảo trì"
          : data?.nextScheduledDate
          ? "Thông tin dịch vụ bảo trì"
          : data?.deviceId
          ? "Thông tin thiết bị"
          : data?.rentPrice
          ? "Thông tin văn phòng"
          : "Thông tin khu vực chung"
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

export default ViewMaintenanceHistory;
