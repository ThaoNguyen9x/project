import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_DISPLAY, FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";

const ViewCustomerContract = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setData(null);
  };

  const generateItems = () => {
    if (data?.startDate) {
      return [
        {
          label: "Khách hàng",
          children: data?.customer?.companyName ? (
            <a
              onClick={() => {
                setData(data?.customer);
                setOpenViewDetail(true);
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
    } else if (data?.role?.name) {
      return [
        { label: "Tên", children: data.name || "N/A", span: 2 },
        { label: "Email", children: data.email || "N/A", span: 2 },
        { label: "Điện thoại", children: data.mobile || "N/A" },
        { label: "Vai trò", children: data.role.name || "N/A" },
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
              onClick={() => {
                setData(data?.user);
                setOpenViewDetail(true);
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
              onClick={() => {
                setData(data?.customerType);
                setOpenViewDetail(true);
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
        data?.startDate
          ? "Thông tin hợp đồng"
          : data?.role?.name
          ? "Thông tin liên hệ"
          : data?.typeName
          ? "Thông tin loại khách hàng"
          : "Thông tin khách hàng"
      }`}
      onClose={onClose}
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

export default ViewCustomerContract;
