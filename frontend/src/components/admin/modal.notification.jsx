import { Modal } from "antd";
import { div } from "framer-motion/client";
import { Link } from "react-router-dom";

const ModalNotification = (props) => {
  const { openNotification, setOpenNotification, notificationDetails } = props;

  const message = notificationDetails?.message
    ? JSON.parse(notificationDetails.message)
    : null;

  const formattedAmount = message?.paymentAmount
    ? message.paymentAmount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
    : "N/A";

  const content =
    notificationDetails?.recipient?.name === "Send payment request" ? (
      <div className="flex flex-col gap-2">
        <p>
          Khách hàng có khoản thanh toán tổng số tiền là{" "}
          <b>{formattedAmount}</b>, hạn chót thanh toán vào
          <b> {message?.paymentDate}</b>.
        </p>
        <Link
          to="/dashboard/payment-contracts"
          onClick={() => setOpenNotification(false)}
        >
          Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.name ===
      "Electricity usage verification" ? (
      <div className="flex flex-col gap-2">
        <p>
          Khách hàng vui lòng kiểm tra đồng hồ số{" "}
          <b> {message?.meter?.serialNumber} </b>
          đã được ghi chỉ số vào ngày <b>{message?.readingDate}</b>:
        </p>

        <p>
          Số đầu kỳ: <b>{message?.startReading}</b>. Số cuối kỳ:{" "}
          <b>{message?.endReading}</b>. Lượng điện tiêu thụ tháng này:
          <b> {message?.usageAmountCurrentMonth}</b> kWh.
        </p>

        <Link
          to="/dashboard/electricity-usages"
          onClick={() => setOpenNotification(false)}
        >
          Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        <p>{notificationDetails?.title}</p>

        <p>{notificationDetails?.description}</p>

        <Link to="">Vui lòng kiểm tra thông tin chi tiết trong hệ thống.</Link>
      </div>
    );

  return (
    <Modal
      title="Thông báo"
      open={openNotification}
      onCancel={() => setOpenNotification(false)}
      footer={null}
    >
      {content}
    </Modal>
  );
};

export default ModalNotification;
