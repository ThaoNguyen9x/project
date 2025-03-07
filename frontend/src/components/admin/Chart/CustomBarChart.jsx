import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomBarChart = (props) => {
  const { user, listPayments, listElectricityUsages } = props;

  // Tính tổng dữ liệu theo tháng
  const calculateTotalByMonth = (data, status, key, amountKey) => {
    const result = new Array(12).fill(0);

    data.forEach((item) => {
      const month = new Date(item.updatedAt || item.readingDate).getMonth();
      if (item[key] === status) {
        result[month] += item[amountKey] || 0;
      }
    });

    return result;
  };

  const paidPayments = Array.isArray(listPayments)
    ? calculateTotalByMonth(
        listPayments,
        "PAID",
        "paymentStatus",
        "paymentAmount"
      )
    : [];

  const unpaidPayments = Array.isArray(listPayments)
    ? calculateTotalByMonth(
        listPayments,
        "UNPAID",
        "paymentStatus",
        "paymentAmount"
      )
    : [];

  const electricityUsageByMonth = Array.isArray(listElectricityUsages)
    ? calculateTotalByMonth(
        listElectricityUsages,
        "YES",
        "status",
        "usageAmount"
      )
    : [];

  const electricityCostByMonth = Array.isArray(listElectricityUsages)
    ? calculateTotalByMonth(
        listElectricityUsages,
        "YES",
        "status",
        "electricityCost"
      )
    : [];

  // Dữ liệu của biểu đồ
  const monthData = Array.from({ length: 12 }, (_, index) => ({
    name: `Tháng ${index + 1}`,
    "Đã thanh toán": user?.role?.name !== "Customer" ? paidPayments[index] : 0,
    "Chưa thanh toán":
      user?.role?.name !== "Customer" ? unpaidPayments[index] : 0,
    "Mức tiêu thụ điện":
      user?.role?.name === "Customer" ? electricityUsageByMonth[index] : 0,
    "Tiền điện":
      user?.role?.name === "Customer" ? electricityCostByMonth[index] : 0,
  }));

  return (
    <div className="h-[450px] shadow-md w-full rounded-md p-5 pb-20 xl:flex-1 bg-white text-blue-950">
      <h2 className="text-xl font-bold mb-5">
        {user?.role?.name === "Customer"
          ? "Mức tiêu thụ điện và tiền điện"
          : "Doanh Thu"}
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthData}>
          <XAxis dataKey="name" stroke="#000" />
          <YAxis stroke="#000" />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "none" }}
            formatter={(value, name) =>
              name === "Mức tiêu thụ điện"
                ? `${value} kWh`
                : `${value?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}`
            }
          />
          {user?.role?.name !== "Customer" && (
            <>
              <Bar
                dataKey="Đã thanh toán"
                fill="#b91c1c"
                animationDuration={800}
                key="paidPaymentsBar"
              />
              <Bar
                dataKey="Chưa thanh toán"
                fill="#7f1d1d"
                animationDuration={800}
                key="unpaidPaymentsBar"
              />
            </>
          )}
          {user?.role?.name === "Customer" && (
            <>
              <Bar
                dataKey="Mức tiêu thụ điện"
                fill="#7f1d1d"
                animationDuration={800}
                key="electricityUsageBar"
              />
              <Bar
                dataKey="Tiền điện"
                fill="#b91c1c"
                animationDuration={800}
                key="electricityCostBar"
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
