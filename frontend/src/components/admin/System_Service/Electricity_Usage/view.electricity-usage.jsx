import dayjs from "dayjs";
import {
  Button,
  Descriptions,
  Drawer,
  message,
  notification,
  Popconfirm,
  Space,
} from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../../utils/constant";
import { useState } from "react";
import {
  callGetContract,
  callGetCustomer,
  callGetMeter,
  callGetOffice,
  callGetUser,
  callGetCustomerType,
  callChangeElectricityUsage,
} from "../../../../services/api";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ViewElectricityUsage = (props) => {
  const {
    user,
    data,
    setData,
    openViewDetail,
    setOpenViewDetail,
    fetchData,
    setCurrent,
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

  const generateItems = () => {
    if (data?.readingDate) {
      return [
        {
          label: "Đồ hồ đo",
          children: data?.meter?.serialNumber ? (
            <a
              onClick={async () => {
                const res = await callGetMeter(data?.meter?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.meter?.serialNumber}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Văn phòng",
          children: data?.meter?.office?.name ? (
            <a
              onClick={async () => {
                const res = await callGetOffice(data?.meter?.office?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {`${data?.meter?.office?.name} - ${data?.meter?.office?.location?.floor}` ||
                "N/A"}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Bắt đầu đọc",
          children: data?.startReading || 0,
        },
        { label: "Kết thúc đọc", children: data?.endReading || 0 },
        {
          label: "Số lượng sử dụng",
          children: `${data?.usageAmount || 0}`,
        },
        ...(data?.previousMonthReadingDate !== null
          ? [
              {
                label: "Tháng trước",
                children: `${data?.previousMonthUsageAmount || 0}`,
              },
            ]
          : []),
        {
          label: "Giá điện",
          children: data?.electricityRate || 0,
          span: 2,
        },
        {
          label: "Chi phí điện",
          children:
            data?.electricityCost.toLocaleString("vi-VI", {
              style: "currency",
              currency: "VND",
            }) || 0,
        },
        ...(data?.previousMonthReadingDate !== null
          ? [
              {
                label: "Tháng trước",
                children: `${
                  data?.previousMonthElectricityCost.toLocaleString("vi-VI", {
                    style: "currency",
                    currency: "VND",
                  }) || 0
                }`,
              },
            ]
          : []),
        { label: "Ngày đọc", children: data?.readingDate || "N/A", span: 2 },
        {
          label: "File",
          children:
            (
              <a
                href={`${
                  import.meta.env.VITE_BACKEND_URL
                }/storage/electricity-usages/${data?.imageName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem
              </a>
            ) || "N/A",
          span: 2,
        },
        { label: "Ghi chú", children: data?.comments || "N/A", span: 2 },
      ];
    } else if (data?.serialNumber) {
      return [
        {
          label: "Serial Number",
          children: data?.serialNumber || "N/A",
          span: 2,
        },
        {
          label: "Loại đồng hồ",
          children:
            data?.meterType === "THREE_PHASE" ? "3 Phase" : "1 Phase" || "N/A",
          span: 2,
        },
        {
          label: "Ngày cài đặt",
          children:
            dayjs(data?.installationDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Văn phòng",
          children: data?.office?.name ? (
            <a
              onClick={async () => {
                const res = await callGetOffice(data?.office?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {`${data?.office?.name} - ${data?.office?.location?.floor}` ||
                "N/A"}
            </a>
          ) : (
            "N/A"
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
    } else if (data?.startDate) {
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
          label: "Trạng thái",
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
                : data?.leaseStatus === "W_Confirmation"
                ? "Đang chờ xác nhận"
                : data?.leaseStatus === "W_Confirmation_2"
                ? "Đang chờ xác nhận lần 2"
                : data?.leaseStatus === "Rejected"
                ? "Thông tin sai"
                : data?.leaseStatus === "Approved"
                ? "Thông tin đúng"
                : ""}
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

  const handleChangeStatus = async (id, status) => {
    const res = await callChangeElectricityUsage(id, status);

    if (res && res.data) {
      message.success("Bạn đã xác nhận thành công");
      fetchData();
      setCurrent(1);
      onClose();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <Drawer
      title={`${
        data?.readingDate
          ? "Thông tin mức tiêu thụ điện"
          : data?.serialNumber
          ? "Thông tin đồng hồ đo"
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
          {user?.role?.name === "Customer" && data?.status === "PENDING" ? (
            <>
              Xác nhận
              <Popconfirm
                placement="leftBottom"
                okText="Có"
                cancelText="Không"
                title="Xác nhận"
                description="Bạn có chắc không?"
                onConfirm={() => handleChangeStatus(data?.id, "YES")}
                icon={
                  <QuestionCircleOutlined
                    style={{
                      color: "red",
                    }}
                  />
                }
              >
                <Button>Đồng ý</Button>
              </Popconfirm>
              <Popconfirm
                placement="leftBottom"
                okText="Có"
                cancelText="Không"
                title="Xác nhận"
                description="Bạn có chắc không?"
                onConfirm={() => handleChangeStatus(data?.id, "NO")}
                icon={
                  <QuestionCircleOutlined
                    style={{
                      color: "red",
                    }}
                  />
                }
              >
                <Button color="danger" variant="solid">
                  Không
                </Button>
              </Popconfirm>
            </>
          ) : (
            ""
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

export default ViewElectricityUsage;
