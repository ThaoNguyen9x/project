import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../utils/constant";

const ViewOffice = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const items = [
    { label: "Tên", children: data?.name || "N/A", span: 2 },
    { label: "Vị trí", children: data?.location.floor || "N/A", span: 2 },
    { label: "Diện tích", children: data?.area + " m²" || "N/A", span: 2 },
    {
      label: "Giá thuê",
      children:
        data?.rentPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) || "N/A",
      span: 2,
    },
    {
      label: "Phí dịch vụ",
      children:
        data?.serviceFee.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) || "N/A",
      span: 2,
    },
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
              data?.status === "ACTIV"
                ? "success"
                : "danger"
            } status`}
          >
            {data?.status === "ACTIV" ? "Hoạt động" : "Không hoạt động"}
          </span>
        ) || "N/A",
      span: 2,
    },
  ];

  if (user?.role?.name === "ADMIN") {
      items.push(
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
        }
      );
    }

  return (
    <Drawer
      title="Thông tin văn phòng"
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

export default ViewOffice;
