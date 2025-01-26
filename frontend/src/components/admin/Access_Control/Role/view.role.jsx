import dayjs from "dayjs";
import { Card, Collapse, Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";

const ViewRole = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const items = [
    { label: "Tên", children: data?.name || "N/A", span: 2 },
    {
      label: "Quyền hạn",
      children: (
        <>
          {data?.permissions && data.permissions.length > 0 ? (
            [
              ...new Set(
                data.permissions.map((permission) => permission.module)
              ),
            ].map((uniqueModule, index) => (
              <Collapse
                className="custom-collapse"
                ghost
                key={index}
                items={[
                  {
                    key: uniqueModule,
                    label: uniqueModule,
                    children: (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {data.permissions
                          .filter(
                            (permission) => permission.module === uniqueModule
                          )
                          .map((permission) => (
                            <Card key={permission.id} size="small">
                              <p>{permission.name}</p>
                              <span
                                className={`font-bold ${
                                  permission?.method === "GET"
                                    ? "GET"
                                    : permission?.method === "POST"
                                    ? "POST"
                                    : permission?.method === "PUT"
                                    ? "PUT"
                                    : permission?.method === "DELETE"
                                    ? "DELETE"
                                    : "text-purple-700"
                                }`}
                              >
                                {permission?.method}
                              </span>
                              <span>: {permission.apiPath}</span>
                            </Card>
                          ))}
                      </div>
                    ),
                  },
                ]}
              />
            ))
          ) : (
            <span>Không có quyền nào được chỉ định</span>
          )}
        </>
      ),
      span: 2,
    },
    {
      label: "Trạng thái",
      children:
        (
          <span className={`${data?.status ? "success" : "danger"} status`}>
            {data?.status ? "Hoạt động" : "Không hoạt động"}
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
      title="Thông tin vai trò"
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

export default ViewRole;
