import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";

const ViewUser = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const items = [
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
      title="Thông tin tài khoản"
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

export default ViewUser;
