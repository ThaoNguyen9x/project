import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomBarChart = () => {
  const monthData = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
    { name: "Jul", sales: 3490, revenue: 4300 },
    { name: "Aug", sales: 2000, revenue: 6800 },
    { name: "Sep", sales: 2780, revenue: 4908 },
    { name: "Oct", sales: 1890, revenue: 2800 },
    { name: "Nov", sales: 2390, revenue: 3300 },
    { name: "Dec", sales: 3490, revenue: 4300 },
  ];

  return (
    <div className="h-[450px] shadow-md w-full rounded-md p-5 pb-20 xl:flex-1 bg-white text-blue-950">
      <h2 className="text-xl font-bold mb-5">Sales and Revenue</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthData}>
          <XAxis dataKey="name" stroke="#000" />
          <YAxis stroke="#000" />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "none" }} />
          <Bar dataKey="sales" fill="#b91c1c" isAnimationActive={false} />
          <Bar dataKey="revenue" fill="#7f1d1d" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
