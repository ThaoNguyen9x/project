import { PieChart, Pie, ResponsiveContainer } from "recharts";

const CustomPieChart = () => {
  const data01 = [
    { name: "Electronics", value: 400 },
    { name: "Fashion", value: 300 },
    { name: "Home Appliances", value: 300 },
    { name: "Books", value: 200 },
  ];

  const data02 = [
    { name: "Accessories", value: 100 },
    { name: "Furniture", value: 300 },
    { name: "Toys", value: 200 },
    { name: "Groceries", value: 400 },
  ];

  return (
    <div className="h-96 shadow-md rounded-md p-5 bg-white text-blue-950 sm:h-[450px] xl:w-[400px]">
      <h2 className="text-xl font-bold mb-5">Sales by Category</h2>
      <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Pie
            data={data01}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#b91c1c"
            nameKey="name"
            label
          />
          <Pie
            data={data02}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#7f1d1d"
            nameKey="name"
            label
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
