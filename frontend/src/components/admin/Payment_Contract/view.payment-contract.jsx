import { Button, Descriptions, Drawer, Space } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../utils/constant";
import dayjs from "dayjs";
import { useState } from "react";
import {
  callGetContract,
  callGetCustomer,
  callGetCustomerType,
  callGetUser,
} from "../../../services/api";

const ViewPaymentContract = (props) => {
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
    if (data?.paymentAmount) {
      return [
        {
          label: "Khách hàng",
          children: (
            <a
              onClick={async () => {
                const res = await callGetCustomer(data?.contract?.customer?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                  console.log(res?.data);
                }
              }}
            >
              Công ty - {data?.contract?.customer?.companyName || "N/A"}
            </a>
          ),
        },
        {
          label: "Số tiền thanh toán",
          children: data?.paymentAmount
            ? data.paymentAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : "N/A",
        },
        {
          label: "Hạn thanh toán",
          children: data?.dueDate || "N/A",
        },
        {
          label: "Ngày thanh toán",
          children: data?.paymentDate || "N/A",
        },
        {
          label: "Trạng thái",
          children:
            (
              <span
                className={`${
                  data?.paymentStatus === "UNPAID" ? "danger" : "success"
                } status`}
              >
                {data?.paymentStatus === "UNPAID"
                  ? "Chưa thanh toán"
                  : "Đã thanh toán"}
              </span>
            ) || "N/A",
        },
      ];
    } else if (data?.contractEndDate) {
      return [
        { label: "Tên", children: data?.name || "N/A" },
        { label: "Điện thoại", children: data?.phone || "N/A" },
        {
          label: "Rating",
          children: (
            <Rate value={data?.rating} disabled style={{ fontSize: 16 }} />
          ),
        },
        {
          label: "Hệ thống",
          children: data?.system?.systemName || "N/A",
        },
        { label: "Ngày bắt đầu", children: data?.contractStartDate || "N/A" },
        { label: "Ngày kết thúc", children: data?.contractEndDate || "N/A" },
      ];
    } else if (data?.description) {
      return [
        { label: "Tên", children: data?.typeName || "N/A" },
        {
          label: "Mô tả",
          children: data?.description || "N/A",
        },
      ];
    } else if (data?.systemName) {
      return [
        { label: "Tên", children: data?.systemName || "N/A" },
        { label: "Mô tả", children: data?.description || "N/A" },
        {
          label: "Chu kỳ bảo trì",
          children: data?.maintenanceCycle || "N/A",
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
        },
        {
          label: "Tổng số tiền",
          children: data?.totalAmount
            ? data?.totalAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : 0,
        },
        {
          label: "Ngày bắt đầu",
          children: dayjs(data?.startDate).format(FORMAT_DATE_DISPLAY) || "N/A",
        },
        {
          label: "Ngày kết thúc",
          children: dayjs(data?.endDate).format(FORMAT_DATE_DISPLAY) || "N/A",
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
    } else if (data?.companyName) {
      return [
        { label: "Công ty", children: data?.companyName || "N/A" },
        { label: "Giám đốc", children: data?.directorName || "N/A" },
        { label: "Email", children: data?.email || "N/A" },
        { label: "Điện thoại", children: data?.phone || "N/A" },
        { label: "Địa chỉ", children: data?.address || "N/A" },
        {
          label: "Ngày sinh",
          children: data?.birthday
            ? dayjs(data?.birthday).format("YYYY-DD-MM")
            : "N/A",
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
        },
      ];
    } else if (data?.role?.name) {
      return [
        { label: "Tên", children: data?.name || "N/A" },
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
    } else if (data?.typeName) {
      return [
        { label: "Tên", children: data?.typeName || "N/A" },
        {
          label: "Hồ sơ",
          children:
            data?.customerTypeDocuments?.map((x) => <p>{x.documentType}</p>) ||
            "N/A",
        },
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
        { label: "Tên", children: data?.name || "N/A" },
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
        },
        {
          label: "Tổng diện tích",
          children: data?.totalArea + " m²" || "N/A",
        },
        {
          label: "Giá thuê",
          children:
            data?.rentPrice?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }) || "N/A",
        },
        {
          label: "Phí dịch vụ",
          children:
            data?.serviceFee?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }) || "N/A",
        },
        { label: "Tọa độ bắt đầu x", children: data?.startX || "N/A" },
        { label: "Tọa độ bắt đầu y", children: data?.startY || "N/A" },
        { label: "Tọa độ kết thúc x", children: data?.endX || "N/A" },
        { label: "Tọa độ kết thúc y", children: data?.endY || "N/A" },
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
        data?.paymentAmount
          ? "Thông tin hợp đồng thanh toán"
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
        </Space>
      }
    >
      <Descriptions items={items} column={1} bordered />
    </Drawer>
  );
};

export default ViewPaymentContract;
