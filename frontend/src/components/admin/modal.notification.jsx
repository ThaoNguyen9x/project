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
    notificationDetails?.recipient?.type === "Contact" ? (
      <div className="flex flex-col gap-2">
        <p>
          ⚠️Khách hàng có một khoản thanh toán với tổng số tiền{" "}
          <b>{formattedAmount}</b>, hạn chót thanh toán vào ngày{" "}
          <b>{message?.dueDate}</b>. Vui lòng kiểm tra chi tiết và thực hiện
          thanh toán đúng hạn.
        </p>

        <Link
          to={`/dashboard/payment-contracts?openViewDetail=true&id=${message?.paymentId}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Payment_Notification_Success" ? (
      <div className="flex flex-col gap-2">
        <p>
          ✅ Khách hàng đã thanh toán thành công với tổng số tiền{" "}
          <b>{formattedAmount}</b>, vào ngày <b>{message?.paymentDate}</b>.
        </p>

        <Link
          to={`/dashboard/payment-contracts?openViewDetail=true&id=${message?.paymentId}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Electricity_Usage_Verification" ? (
      <div className="flex flex-col gap-2">
        <p>
          <b>Xác nhận chỉ số điện: </b>
          Khách hàng vui lòng kiểm tra đồng hồ số{" "}
          <b>{message?.meter?.serialNumber}</b>, chỉ số đã được ghi vào ngày{" "}
          <b>{message?.readingDate}</b>:
        </p>

        <p>
          🔹 Số đầu kỳ: <b>{message?.startReading}</b> <br />
          🔹 Số cuối kỳ: <b>{message?.endReading}</b> <br />
          🔹 Lượng điện tiêu thụ tháng này:{" "}
          <b>{message?.usageAmountCurrentMonth}</b> kWh
          {message?.id}
        </p>

        <Link
          to={`/dashboard/electricity-usages?openViewDetail=true&id=${message?.electricityId}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type === "Electricity_Usage_Customer" &&
      message?.status === "NO" ? (
      <div className="flex flex-col gap-2">
        <p>
          ⚡ <b>Lưu ý:</b> Khách hàng không chấp nhận số điện đã ghi. Vui lòng
          kiểm tra lại và liên hệ để xác nhận.
        </p>

        <Link
          to={`/dashboard/electricity-usages?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type === "Electricity_Usage_Customer" &&
      message?.status === "YES" ? (
      <div className="flex flex-col gap-2">
        <p>
          ✅ <b>Xác nhận:</b> Khách hàng đã đồng ý với số điện đã ghi. Vui lòng
          tiến hành tạo hóa đơn thanh toán.
        </p>

        <Link
          to={`/dashboard/electricity-usages?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type === "Birthday_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>
          🎂 Ngày <b>{message?.birthday}</b> là sinh của nhật của khách hàng{" "}
          <b>{message?.directorName}</b>, giám đốc công ty{" "}
          <b>{message?.companyName}</b>. Hãy gửi lời chúc mừng đến họ!
        </p>

        <Link
          to={`/dashboard/customer-contracts?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Repair_Request_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>
          Bạn có một yêu cầu sữa chữa vào ngày{" "}
          <b>{new Date(message?.requestDate).toLocaleDateString("vi-VN")}</b>
        </p>

        <Link
          to={`/dashboard/repair-requests?openViewDetail=true&id=${message?.requestID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Work_Registration_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>
          Bạn có một đăng ký thi công vào ngày{" "}
          <b>
            {new Date(message?.registrationDate).toLocaleDateString("vi-VN")}
          </b>
        </p>

        <Link
          to={`/dashboard/work-registrations?openViewDetail=true&id=${message?.registrationID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Work_Register_Notification_Customer" ? (
      <div className="flex flex-col gap-2">
        <p>
          Đăng ký thi công của quý khách vào ngày{" "}
          <b>
            {new Date(message?.registrationDate).toLocaleDateString("vi-VN")}
          </b>{" "}
          đã{" "}
          {message?.status === "APPROVED"
            ? "được chấp nhận"
            : message?.status === "REJECTED"
            ? "bị từ chối"
            : "hoàn thành"}
          .
        </p>

        <Link
          to={`/dashboard/work-registrations?openViewDetail=true&id=${message?.registrationID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Repair_Request_Notification_Customer" ? (
      <div className="flex flex-col gap-2">
        <p>
          Yêu cầu sửa chữa của quý khách đã{" "}
          {message?.status === "SUCCESS" ? "hoàn thành" : "thất bại"}. Nếu như
          quý khách có vấn đề gì khác, hãy liên hệ với chung tôi.
        </p>

        <Link
          to={`/dashboard/repair-requests?openViewDetail=true&id=${message?.requestID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type === "Due_Payment_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>
          Khoản thanh toán đến hạn, thời hạn cuối là ngày{" "}
          <b>{new Date(message?.dueDate).toLocaleDateString("vi-VN")}</b>
        </p>

        <Link
          to={`/dashboard/payment-contracts?openViewDetail=true&paymentId=${message?.paymentId}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type === "Exp_Payment_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>Khoản thanh toán hết hạn</p>

        <Link
          to={`/dashboard/payment-contracts?openViewDetail=true&paymentId=${message?.paymentId}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Maintenance_Task_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>
          Bạn có nhiệm vụ bảo trì vào ngày{" "}
          <b>{new Date(message?.notifications).toLocaleDateString("vi-VN")}</b>
        </p>

        <Link
          to={`/dashboard/notifications?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </div>
    ) : notificationDetails?.recipient?.type ===
      "Repair_Proposal_Notification" ? (
      <div className="flex flex-col gap-2">
        <p>
          Bạn có thông báo yêu cầu sửa chữa ngày{" "}
          <b>{new Date(message?.requestDate).toLocaleDateString("vi-VN")}</b>
        </p>
        <Link
          to={`/dashboard/repair-proposals?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
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
            Kiểm tra thông tin chi tiết trong hệ thống.
          </Link>
        ) : (
          <Link
            to={`/dashboard/notifications?openViewDetail=true&id=${message?.id}`}
            onClick={() => setOpenNotification(false)}
          >
            Kiểm tra thông tin chi tiết trong hệ thống.
          </Link>
        )}
      </div>
    );

  return (
    <Modal
      title="📢 Thông báo"
      open={openNotification}
      onCancel={() => setOpenNotification(false)}
      footer={null}
    >
      {content}
    </Modal>
  );
};

export default ModalNotification;
