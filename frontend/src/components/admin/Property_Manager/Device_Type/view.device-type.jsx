import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";

const ViewDeviceType = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const items = [
    {
      label: "Tên",
      children: data?.typeName || "N/A",
      span: 2,
    },
    {
      label: "Mô tả",
      children: data?.description || "N/A",
      span: 2,
    },
  ];

  if (user?.role?.name === "Application_Admin") {
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
      title="Thông tin loại thiết bị"
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

export default ViewDeviceType;
