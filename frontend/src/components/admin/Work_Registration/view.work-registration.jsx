import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../utils/constant";

const ViewWorkRegistration = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const generateItems = () => {
    if (data?.registrationDate) {
      return [
        {
          label: "Ngày đăng ký",
          children:
            dayjs(data?.registrationDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Ngày dự kiến",
          children:
            dayjs(data?.scheduledDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Nội dung",
          children: data?.note,
          span: 2,
        },
        {
          label: "Nhân viên phụ trách",
          children: data?.account?.name ? (
            <a
              onClick={() => {
                setData(data?.account);
                setOpenViewDetail(true);
              }}
            >
              {data?.account?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Bản vẽ",
          children:
            (
              <a
                href={`${
                  import.meta.env.VITE_BACKEND_URL
                }/storage/work_registrations/${data?.drawingUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data?.drawingUrl}
              </a>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children: (
            <span
              className={`status ${
                data?.status === "PENDING"
                  ? "warning"
                  : data?.status === "REJECTED"
                  ? "danger"
                  : "success"
              }`}
            >
              {data?.status === "PENDING"
                ? "Đang chờ duyệt"
                : data?.status === "APPROVED"
                ? "Đã được duyệt"
                : "Bị từ chối"}
            </span>
          ),
          span: 2,
        },
      ];
    } else {
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
    }
  };

  let items = generateItems();

  if (user?.role?.name === "ADMIN") {
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
      title={`${data?.registrationDate ? "Thông tin đăng ký công việc" : "Thông tin liên hệ"}`}
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

export default ViewWorkRegistration;
