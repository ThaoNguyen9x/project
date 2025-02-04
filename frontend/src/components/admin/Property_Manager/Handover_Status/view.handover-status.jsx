import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";
import dayjs from "dayjs";

const ViewHandoverStatus = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const generateItems = () => {
    if (data?.equipmentFile) {
      return [
        { label: "Thiết bị", children: data?.equipmentFile || "N/A", span: 2 },
        {
          label: "Văn phòng",
          children: data?.office?.name ? (
            <a
              onClick={() => {
                setData(data?.office);
                setOpenViewDetail(true);
              }}
            >
              {data?.office?.name} - {data?.office?.location?.floor}
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
                }/storage/handover_status/${data?.drawingFile}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data?.drawingFile}
              </a>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Ngày bàn giao",
          children: dayjs(data?.handoverDate).format("YYYY-MM-DD") || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children:
            (
              <span
                className={`${
                  data?.status == "ACTIV" ? "success" : "danger"
                } status`}
              >
                {data?.status == "ACTIV" ? "Hoạt động" : "Không hoạt động"}
              </span>
            ) || "N/A",
          span: 2,
        },
      ];
    } else {
      return [
        {
          label: "Tên",
          children: `${data?.name} - ${data?.location?.floor}`,
          span: 2,
        },
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
      title={`${data?.equipmentFile ? "Thông tin tình trạng bàn giao" : "Thông tin văn phòng"}`}
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

export default ViewHandoverStatus;
