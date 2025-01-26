import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";

const ViewTask = (props) => {
  const { data, setData, openViewDetail, setOpenViewDetail } = props;

  const commonItems = [
    {
      label: "Ngày tạo",
      children:
        dayjs(data?.createdAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      span: 2,
    },
    {
      label: "Ngày cập nhật",
      children:
        dayjs(data?.updatedAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      span: 2,
    },
    {
      label: "Tạo bởi",
      children: data?.createdBy || "N/A",
      span: 2,
    },
    {
      label: "Cập nhật bởi",
      children: data?.updatedBy || "N/A",
      span: 2,
    },
  ];

  const specificItems = data?.taskName
    ? [
        {
          label: "Nhiệm vụ",
          children: data?.taskName || "N/A",
          span: 2,
        },
        {
          label: "Mô tả",
          children: data?.taskDescription || "N/A",
          span: 2,
        },
        {
          label: "Loại bảo trì",
          children:
            (
              <span
                className={`${
                  data?.maintenanceType == "SCHEDULED" ? "success" : "warning"
                } status`}
              >
                {data?.maintenanceType == "SCHEDULED"
                  ? "Bảo trì định kỳ"
                  : "Bảo trì sự cố đột xuất"}
              </span>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Nhân viên phụ trách",
          children: data?.assignedTo?.name ? (
            <a
              onClick={() => {
                setData(data?.assignedTo);
                setOpenViewDetail(true);
              }}
            >
              {data?.assignedTo?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Số điện thoại khác",
          children: data?.assignedToPhone || "N/A",
          span: 2,
        },
        {
          label: "Thời gian dự kiến hoàn thành",
          children: data?.expectedDuration || "N/A",
          span: 2,
        },
      ]
    : [
        {
          label: "Họ và tên",
          children: data?.name || "N/A",
          span: 2,
        },
        {
          label: "E-mail",
          children: data?.email || "N/A",
          span: 2,
        },
        {
          label: "Điện thoại",
          children: data?.mobile || "N/A",
          span: 2,
        },
      ];

  const items = [...specificItems, ...commonItems];

  return (
    <Drawer
      title="Chi tiết"
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

export default ViewTask;
