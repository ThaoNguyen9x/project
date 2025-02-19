import { Modal } from "antd";
import { Link } from "react-router-dom";

const ModalNotification = (props) => {
  const { openNotification, setOpenNotification, notificationDetails } = props;

  const message = notificationDetails?.message
    ? JSON.parse(notificationDetails.message)
    : null;

  const formattedAmount = message?.paymentAmount
    ? message.paymentAmount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
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
          to={`/dashboard/payment-contracts?openViewDetail=true&paymentId=${message?.paymentId}`}
          onClick={() => setOpenNotification(false)}
        >
          Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Electricity_Usage_Verification" ? (
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
          to={`/dashboard/electricity-usages?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.name === "Send birthday request" ? (
      <div className="flex flex-col gap-2">
        <p>
          Ngày <b>{message?.birthday}</b> là sinh của nhật của khách hàng{" "}
          <b>{message?.directorName}</b> của công ty{" "}
          <b>{message?.companyName}</b>.
        </p>

        <Link
          to="/dashboard/customers"
          onClick={() => setOpenNotification(false)}
        >
          Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Repair_Request_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>
          Có một yêu cầu sữa chữa vào ngày{" "}
          <b>{new Date(message?.requestDate).toLocaleDateString("vi-VN")}</b>
        </p>

        <Link
          to={`/dashboard/repair-requests?openViewDetail=true&requestID=${message?.requestID}`}
          onClick={() => setOpenNotification(false)}
        >
          Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Work_Registration_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>
          Có một đăng ký công việc vào ngày{" "}
          <b>
            {new Date(message?.registrationDate).toLocaleDateString("vi-VN")}
          </b>
        </p>

        <Link
          to={`/dashboard/work-registrations?openViewDetail=true&registrationID=${message?.registrationID}`}
          onClick={() => setOpenNotification(false)}
        >
          Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        <p>{message?.title}</p>

        <p>{message?.description}</p>

        {notificationDetails?.recipient?.type ===
        "Repair_Proposal_Notification" ? (
          <Link
            to={`/dashboard/repair-proposals?openViewDetail=true&id=${message?.id}`}
            onClick={() => setOpenNotification(false)}
          >
            Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
          </Link>
        ) : (
          <Link
            to={`/dashboard/notifications?openViewDetail=true&id=${message?.id}`}
            onClick={() => setOpenNotification(false)}
          >
            Vui lòng kiểm tra thông tin chi tiết trong hệ thống.
          </Link>
        )}
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
