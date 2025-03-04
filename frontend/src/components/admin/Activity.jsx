import { Avatar, List } from "antd";

const Activity = (props) => {
  const { listUsers, userStatus } = props;

  return (
    <div className="shadow-md rounded-md bg-white p-5 xl:w-[400px]">
      <h2 className="text-xl font-bold mb-5 text-blue-950">Tài khoản</h2>
      <div className="relative overflow-x-auto">
        <List
          itemLayout="horizontal"
          dataSource={listUsers.slice(0, 5)}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                key={item?.id}
                avatar={
                  <div className="relative">
                    <Avatar
                      size={32}
                      className="h-10 w-10 rounded-full border-2 bg-red-700"
                    >
                      {item?.role?.name[0]?.toUpperCase()}
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 size-2 ${
                        userStatus[item?.id] === "online"
                          ? "bg-green-600"
                          : "bg-red-600"
                      } rounded-full`}
                    />
                  </div>
                }
                title={item?.name}
                description={
                  userStatus[item?.id] === "online" ? "Online" : "Offline"
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Activity;
