import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../utils/constant";

const ViewWorkRegistration = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const generateItems = () => {
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
        label: "Nhân viên phụ trách bảo trì",
        children: data?.account,
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
                : data?.status === "COMPLETED"
                ? "success"
                : "success"
            }`}
          >
            {data?.status === "PENDING"
              ? "Đang chờ xử lý"
              : data?.status === "APPROVED"
              ? "Đã chấp nhận"
              : data?.status === "COMPLETED"
              ? "Đã hoàn thành"
              : "Đã từ chối"}
          </span>
        ),
        span: 2,
      },
    ];
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
        data?.registrationDate
          ? "Thông tin đăng ký công việc"
          : "Thông tin liên hệ"
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

export default ViewWorkRegistration;
