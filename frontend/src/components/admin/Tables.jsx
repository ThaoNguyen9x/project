import { Table } from "antd";

const Tables = (props) => {
  const { listPayments } = props;

  const columns = [
    {
      title: "Name",
      dataIndex: ["contract", "customer", "companyName"],
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "date",
    },
    {
      title: "Số tiền thanh toán",
      dataIndex: "paymentAmount",
      key: "amount",
      render: (amount) =>
        amount?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
  ];

  const activePayments = Array.isArray(listPayments)
    ? listPayments
        .filter((payment) => payment?.paymentStatus === "PAID")
        .slice(0, 5)
    : [];

  return (
    <div className="flex-1 shadow-md rounded-md p-5 bg-white">
      <h2 className="text-xl font-bold mb-5 text-blue-950">Thanh toán</h2>
      <div className="relative overflow-x-auto">
        <Table
          columns={columns}
          dataSource={activePayments}
          pagination={false}
          rowKey={(record) => record?.paymentId}
        />
      </div>
    </div>
  );
};

export default Tables;
