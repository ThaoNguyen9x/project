import { Table } from "antd";

const Tables = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const data = [
    { id: 1, name: "John Doe", date: "2023-01-15", amount: "$120.00" },
    { id: 2, name: "Jane Smith", date: "2023-01-18", amount: "$80.00" },
    { id: 3, name: "Alice Johnson", date: "2023-01-20", amount: "$250.00" },
    { id: 4, name: "Bob Brown", date: "2023-01-25", amount: "$180.00" },
    { id: 5, name: "Michael Green", date: "2023-02-01", amount: "$50.00" },
  ];

  return (
    <div className="flex-1 shadow-md rounded-md p-5 bg-white">
      <h2 className="text-xl font-bold mb-5 text-blue-950">Receipt</h2>
      <div className="relative overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey={(record) => record.id}
        />
      </div>
    </div>
  );
};

export default Tables;
