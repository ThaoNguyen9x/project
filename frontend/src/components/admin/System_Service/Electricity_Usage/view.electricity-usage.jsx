import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
} from "../../../../utils/constant";

const ViewElectricityUsage = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const generateItems = () => {
    if (data?.usageAmount) {
      return [
        {
          label: "Đồ hồ đo",
          children: data?.meter?.serialNumber ? (
            <a
              onClick={() => {
                setData(data?.meter);
                setOpenViewDetail(true);
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
              onClick={() => {
                setData(data?.meter?.office);
                setOpenViewDetail(true);
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
          children: data?.startReading || "N/A",
          span: 2,
        },
        { label: "Kết thúc đọc", children: data?.endReading || "N/A", span: 2 },
        {
          label: "Giá điện",
          children: data?.electricityRate || "N/A",
          span: 2,
        },
        {
          label: "Chi phí điện",
          children: data?.electricityCost || "N/A",
          span: 2,
        },
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
                {data?.imageName}
              </a>
            ) || "N/A",
          span: 2,
        },
        { label: "Bình luận", children: data?.comments || "N/A", span: 2 },
      ];
    } else if (data?.name) {
      return [
        { label: "Tên", children: data?.name || "N/A", span: 2 },
        { label: "Vị trí", children: data?.location?.floor || "N/A", span: 2 },
        { label: "Diện tích", children: data?.area + " m²" || "N/A", span: 2 },
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
    } else {
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
              onClick={() => {
                setData(data?.office);
                setOpenViewDetail(true);
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
        data?.usageAmount
          ? "Thông tin mức tiêu thụ điện"
          : data?.name
          ? "Thông tin văn phòng"
          : "Thông tin đồng hồ đo"
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

export default ViewElectricityUsage;
