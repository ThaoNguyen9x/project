import dayjs from "dayjs";
import { Button, Descriptions, Drawer, Space, Steps } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../../utils/constant";
import { useState } from "react";
import {
  callGetCustomer,
  callGetCustomerType,
  callGetUser,
} from "../../../../services/api";

const ViewCustomerContract = (props) => {
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
    if (data?.startDate) {
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
          label: "File hợp đồng",
          children:
            (
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/storage/contracts/${
                  data?.fileName
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
    } else if (data?.description) {
      return [
        { label: "Tên", children: data?.typeName || "N/A", span: 2 },
        {
          label: "Mô tả",
          children: data?.description || "N/A",
          span: 2,
        },
      ];
    } else {
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
        {
          label: "Hồ sơ",
          children: (
            <Steps
              direction="vertical"
              size="small"
              current={1}
              items={
                data?.customerType?.customerTypeDocuments?.map((x) => {
                  const filePath = x?.customerDocuments?.[0]?.filePath;
                  return {
                    title: x?.documentType,
                    description: filePath ? (
                      <a
                        href={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/storage/customer_documents/${filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem
                      </a>
                    ) : (
                      <span className="text-red-600 font-bold">Đang thiếu</span>
                    ),
                    status: filePath ? "finish" : "error",
                  };
                }) || []
              }
            />
          ),
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

export default ViewCustomerContract;
