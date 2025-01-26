import CardItem from "./CardItem";
import { PieChartOutlined } from "@ant-design/icons";

const Card = () => {
  const cardItems = [
    {
      icon: (
        <PieChartOutlined className="rounded-full bg-red-700 p-2 text-4xl text-white" />
      ),
      title: "Total Earning",
      value: "$2200",
    },
    {
      icon: (
        <PieChartOutlined className="rounded-full bg-red-700 p-2 text-4xl text-white" />
      ),
      title: "Total Sales",
      value: "$1500",
    },
    {
      icon: (
        <PieChartOutlined className="rounded-full bg-red-700 p-2 text-4xl text-white" />
      ),
      title: "New Clients",
      value: "120",
    },
    {
      icon: (
        <PieChartOutlined className="rounded-full bg-red-700 p-2 text-4xl text-white" />
      ),
      title: "Total Orders",
      value: "320",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {cardItems.map((item, index) => (
        <CardItem item={item} key={index} />
      ))}
    </div>
  );
};

export default Card;
