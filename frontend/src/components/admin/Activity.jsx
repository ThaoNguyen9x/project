import { Avatar, List } from "antd";

const data = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    name: "John Doe",
    activity: "Purchased a new laptop",
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    name: "Jane Smith",
    activity: "Subscribed to a premium plan",
  },
  {
    id: 3,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    name: "Robert Brown",
    activity: "Made a payment of $500",
  },
  {
    id: 4,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    name: "Alice Johnson",
    activity: "Updated her profile information",
  },
  {
    id: 5,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    name: "Michael Green",
    activity: "Completed a task",
  },
];

const Activity = () => (
  <div className="shadow-md rounded-md bg-white p-5 xl:w-[400px]">
    <h2 className="text-xl font-bold mb-5 text-blue-950">Recent Activities</h2>
    <div className="relative overflow-x-auto">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              key={item.id}
              avatar={
                <Avatar
                  src={item.image}
                  className="h-10 w-10 rounded-full border-2 border-red-700"
                />
              }
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.activity}
            />
          </List.Item>
        )}
      />
    </div>
  </div>
);
export default Activity;
