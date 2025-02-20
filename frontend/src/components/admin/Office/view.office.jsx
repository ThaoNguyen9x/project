import dayjs from "dayjs";
import { Button, Descriptions, Drawer, Rate, Space } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../utils/constant";
import {
  callGetContract,
  callGetCustomer,
  callGetCustomerType,
  callGetDeviceType,
  callGetSubcontract,
  callGetSystem,
  callGetUser,
} from "../../../services/api";
import { useState } from "react";

const ViewOffice = (props) => {
  const {
    user,
    data,
    setData,
    openViewDetail,
    setOpenViewDetail,
    setOpenModal,
  } = props;
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

  const isOffice =
    data &&
    !(
      data.deviceId ||
      data.contractEndDate ||
      data.description ||
      data.systemName ||
      data.fileName ||
      data.companyName ||
      data.role?.name ||
      data.typeName
    );

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
        { label: "Tọa độ x", children: data?.x || "N/A" },
        { label: "Tọa độ y", children: data?.y || "N/A" },
        {
          label: "Dịch vụ bảo trì",
          children: (
            <>
              {data?.maintenanceService?.subcontractor?.name ? (
                <a
                  onClick={async () => {
                    const res = await callGetSubcontract(
                      data?.maintenanceService?.id
                    );
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  {data?.maintenanceService?.subcontractor?.name}
                </a>
              ) : (
                "N/A"
              )}
            </>
          ),
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
          label: "File",
          children:
            (
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/storage/contracts/${
                  data?.fileName
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data?.fileName}
              </a>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children: (
            <span
              className={`${
                data?.leaseStatus === "Active"
                  ? "success"
                  : data?.leaseStatus === "Inactive"
                  ? "danger"
                  : "warning"
              } status`}
            >
              {data?.leaseStatus === "Active"
                ? "Hoạt động"
                : data?.leaseStatus === "Inactive"
                ? "Đã chấm dứt"
                : "Đang chờ gia hạn"}
            </span>
          ),
          span: 2,
        },
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
            data?.customerTypeDocuments?.map((x) => <p>{x.documentType}</p>) ||
            "N/A",
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
    } else {
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
                {data?.drawingFile}
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
        data?.deviceId
          ? "Thông tin thiết bị"
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
          : "Thông tin văn phòng"
      }`}
      onClose={onClose}
      open={openViewDetail}
      width={window.innerWidth > 900 ? 800 : window.innerWidth}
      extra={
        <Space>
          {historyStack.length > 0 && (
            <Button onClick={goBack}>Quay lại</Button>
          )}
          {isOffice && (
            <Button
              type="primary"
              onClick={async () => {
                const res = await callGetContract(data?.contracts[0]?.id);
                if (res?.data) {
                  setOpenViewDetail(false);
                  setData(res?.data);
                  setOpenModal(res?.data);
                }
              }}
            >
              Chỉnh sửa
            </Button>
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

export default ViewOffice;
