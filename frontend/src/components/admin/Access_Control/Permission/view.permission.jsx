import dayjs from "dayjs";
import { Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";

const ViewPermission = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const items = [
    { label: "Tên", children: data?.name || "N/A" },
    { label: "API Path", children: data?.apiPath || "N/A" },
    {
      label: "Method",
      children:
        (
          <p
            className={`font-bold ${
              data?.method === "GET"
                ? "GET"
                : data?.method === "POST"
                ? "POST"
                : data?.method === "PUT"
                ? "PUT"
                : data?.method === "DELETE"
                ? "DELETE"
                : "text-purple-700"
            }`}
          >
            {data?.method}
          </p>
        ) || "N/A",
    },
    { label: "Module", children: data?.module || "N/A" },
    {
      label: "Trạng thái",
      children:
        (
          <span className={`${data?.status ? "success" : "danger"} status`}>
            {data?.status ? "Hoạt động" : "Không hoạt động"}
          </span>
        ) || "N/A",
    },
  ];

  if (user?.role?.name === "Application_Admin") {
    items.push(
      {
        label: "Ngày tạo",
        children:
          dayjs(data?.createdAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      },
      {
        label: "Ngày cập nhật",
        children:
          dayjs(data?.updatedAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      },
      {
        label: "Tạo bởi",
        children: data?.createdBy || "N/A",
      },
      {
        label: "Cập nhật bởi",
        children: data?.updatedBy || "N/A",
      }
    );
  }

  return (
    <Drawer
      title="Thông tin quyền hạn"
      onClose={() => setOpenViewDetail(false)}
      open={openViewDetail}
      width={window.innerWidth > 900 ? 800 : window.innerWidth}
    >
      <Descriptions items={items} column={1} bordered />
    </Drawer>
  );
};

export default ViewPermission;
