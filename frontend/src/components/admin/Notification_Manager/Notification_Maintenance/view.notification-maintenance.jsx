import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";

const ViewNotificationMaintenance = (props) => {
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

  const specificItems = data?.title
    ? [
        {
          label: "Tiêu đề",
          children: data?.title || "N/A",
          span: 2,
        },
        {
          label: "Tin nhắn",
          children: data?.description || "N/A",
          span: 2,
        },
        {
          label: "Người nhận",
          children: data?.recipient || "N/A",
          span: 2,
        },
        {
          label: "Ngày bảo trì",
          children:
            dayjs(data?.maintenanceDate).format(FORMAT_DATE_TIME_DISPLAY) ||
            "N/A",
          span: 2,
        },
        {
          label: "Nhiệm vụ bảo trì",
          children: data?.maintenanceTask?.taskName ? (
            <a
              onClick={() => {
                setData(data?.maintenanceTask);
                setOpenViewDetail(true);
              }}
            >
              {data?.maintenanceTask?.taskName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
      ]
    : [
        {
          label: "Nhiệm vụ bảo trì",
          children: data?.taskName || "N/A",
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

export default ViewNotificationMaintenance;
