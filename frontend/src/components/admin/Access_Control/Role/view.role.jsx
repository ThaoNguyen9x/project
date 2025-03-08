import dayjs from "dayjs";
import { Card, Collapse, Descriptions, Drawer } from "antd";
import { FORMAT_DATE_TIME_DISPLAY } from "../../../../utils/constant";

const ViewRole = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail } = props;

  const items = [
    { label: "Tên", children: data?.name || "N/A" },
    {
      label: "Quyền hạn",
      children: (
        <div className="max-h-fit overflow-y-auto w-full h-[calc(100vh-25rem)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
          {data?.permissions && data?.permissions.length > 0 ? (
            [
              ...new Set(
                data?.permissions.map((permission) => permission?.module)
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
                        {data?.permissions
                          .filter(
                            (permission) => permission?.module === uniqueModule
                          )
                          .map((permission) => (
                            <Card key={permission?.id} size="small">
                              <p>{permission?.name}</p>
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
                              <span>: {permission?.apiPath}</span>
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
        </div>
      ),
    },
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
      title="Thông tin vai trò"
      onClose={() => setOpenViewDetail(false)}
      open={openViewDetail}
      width={window.innerWidth > 900 ? 800 : window.innerWidth}
    >
      <Descriptions items={items} column={1} bordered />
    </Drawer>
  );
};

export default ViewRole;
