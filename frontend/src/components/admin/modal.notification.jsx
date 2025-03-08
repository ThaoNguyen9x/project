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

  const notificationTypes = {
    Contact: (
      <>
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
      </>
    ),
    Payment_Notification_Success: (
      <>
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
      </>
    ),
    Electricity_Usage_Verification: (
      <>
        <p>
          <b>Xác nhận chỉ số điện:</b> Khách hàng vui lòng kiểm tra đồng hồ số{" "}
          <b>{message?.meter?.serialNumber}</b>, chỉ số đã được ghi vào ngày{" "}
          <b>{message?.readingDate}</b>.
        </p>
        <p>
          🔹 Số đầu kỳ: <b>{message?.startReading}</b> <br /> 🔹 Số cuối kỳ:{" "}
          <b>{message?.endReading}</b> <br /> 🔹 Lượng điện tiêu thụ tháng này:{" "}
          <b>{message?.usageAmountCurrentMonth}</b> kWh
        </p>
        <Link
          to={`/dashboard/electricity-usages?openViewDetail=true&id=${message?.electricityId}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Electricity_Usage_Customer:
      message?.status === "NO" ? (
        <>
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
        </>
      ) : (
        <>
          <p>
            ✅ <b>Xác nhận:</b> Khách hàng đã đồng ý với số điện đã ghi. Vui
            lòng tiến hành tạo hóa đơn thanh toán.
          </p>
          <Link
            to={`/dashboard/electricity-usages?openViewDetail=true&id=${message?.id}`}
            onClick={() => setOpenNotification(false)}
          >
            Kiểm tra thông tin chi tiết trong hệ thống.
          </Link>
        </>
      ),
    Birthday_Notification: (
      <>
        <p>
          🎂 Ngày <b>{message?.birthday}</b> là sinh nhật của khách hàng{" "}
          <b>{message?.directorName}</b>, giám đốc công ty{" "}
          <b>{message?.companyName}</b>. Hãy gửi lời chúc mừng đến họ!
        </p>
        <Link
          to={`/dashboard/customer-contracts?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Repair_Request_Notification: (
      <>
        <p>
          Bạn có một yêu cầu sửa chữa vào ngày{" "}
          <b>{new Date(message?.requestDate).toLocaleDateString("vi-VN")}</b>.
          Vui lòng kiểm tra thông tin và điều nhân viên kỹ thuật đi kiểm tra
          hiện trạng.
        </p>
        <Link
          to={`/dashboard/repair-requests?openViewDetail=true&id=${message?.requestID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Repair_Request_Notification_Technician: (
      <>
        <p>
          Bạn có một nhiệm vụ sửa chữa vào ngày{" "}
          <b>{new Date(message?.requestDate).toLocaleDateString("vi-VN")}</b>.
          Nhiệm vụ được điều động từ cấp trên, vui lòng nhanh chóng kiểm tra và
          phản hồi.
        </p>
        <Link
          to={`/dashboard/repair-requests?openViewDetail=true&id=${message?.requestID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Maintenance_Task_Notification: (
      <>
        <p>
          Có một thông báo bảo trì được gửi vào ngày{" "}
          <b>{new Date(message?.createdAt).toLocaleDateString("vi-VN")}</b>. Vui
          lòng kiểm tra.
        </p>
        <Link
          to={`/dashboard/notifications?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Repair_Request_Notification_Customer: (
      <>
        <p>
          Yêu cầu sửa chữa đã được kỹ thuật viên{" "}
          <b>{message?.technician?.name}</b>{" "}
          {message?.status === "SUCCESS" ? (
            <>
              xử lý và hoàn thành <b>thành công</b>.
            </>
          ) : (
            <>
              xử lý nhưng <b>không thể hoàn thành</b> do có sự cố phát sinh.
            </>
          )}{" "}
          Quý khách vui lòng kiểm tra thông tin chi tiết và liên hệ với chúng
          tôi nếu cần thêm hỗ trợ.
        </p>

        <Link
          to={`/dashboard/repair-requests?openViewDetail=true&id=${message?.requestID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Repair_Request_Notification_Complete: (
      <>
        <p>
          Yêu cầu sửa chữa được phân bổ nhiệm vụ cho kỹ thuật viên{" "}
          <b>{message?.technician?.name}</b>{" "}
          {message?.status === "SUCCESS" ? (
            <>
              xử lý và hoàn thành <b>thành công</b>.
            </>
          ) : (
            <>
              xử lý nhưng <b>không thể hoàn thành</b> do có sự cố phát sinh.
            </>
          )}{" "}
        </p>
        <Link
          to={`/dashboard/repair-requests?openViewDetail=true&id=${message?.requestID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Work_Register_Notification_Customer: (
      <>
        <p>
          Đăng ký thi công của quý khách vào ngày{" "}
          <b>
            {new Date(message?.registrationDate).toLocaleDateString("vi-VN")}
          </b>{" "}
          đã{" "}
          <b>
            {message?.status === "APPROVED"
              ? "được chấp nhận"
              : message?.status === "REJECTED"
              ? "bị từ chối"
              : "hoàn thành"}
          </b>
          . Vui lòng kiểm tra thông tin chi tiết và liên hệ với chúng tôi nếu
          cần thêm hỗ trợ.
        </p>

        <Link
          to={`/dashboard/work-registrations?openViewDetail=true&id=${message?.registrationID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Work_Registration_Notification: (
      <>
        <p>
          Bạn có yêu cầu đăng ký thi công của công ty{" "}
          <b>{message?.account?.customer?.companyName}</b> vào ngày{" "}
          <b>
            {new Date(message?.registrationDate).toLocaleDateString("vi-VN")}
          </b>
          . Vui lòng kiểm tra và phản hồi lại khách hàng.
        </p>

        <Link
          to={`/dashboard/work-registrations?openViewDetail=true&id=${message?.registrationID}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Due_Payment_Notification: (
      <>
        <p>
          Khoản thanh toán đến hạn, thời hạn cuối là ngày{" "}
          <b>{new Date(message?.dueDate).toLocaleDateString("vi-VN")}</b>
        </p>

        <Link
          to={`/dashboard/payment-contracts?openViewDetail=true&id=${message?.paymentId}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Exp_Payment_Notification: (
      <>
        <p>
          Khoản thanh toán đã hết hạn
          <b>{new Date(message?.dueDate).toLocaleDateString("vi-VN")}</b>
        </p>

        <Link
          to={`/dashboard/payment-contracts?openViewDetail=true&id=${message?.paymentId}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Due_Contract_Notification: (
      <>
        <p>
          Hợp đồng của khách hàng công ty{" "}
          <b>{message?.customer?.companyName}</b> còn 30 ngày nữa là hết hạn.
          Vui lòng liên hệ khách hàng để gia hạn hợp đồng. Nếu khách hàng không
          muốn gia hạn, vui lòng hướng dẫn các thủ tục thanh lý hợp đồng.
        </p>
        <Link
          to={`/dashboard/customer-contracts?openViewDetail=true&id=${message?.contract?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Repair_Proposal_Notification: (
      <>
        <p>
          Bộ phận Kỹ thuật đã hoàn thành đánh giá rủi ro và đề xuất phương án
          bảo trì vào ngày <b>{message?.requestDate}</b>.
        </p>
        <Link
          to={`/dashboard/quotations-repair-proposals?openViewDetail=true&id=${message?.id}`}
          onClick={() => setOpenNotification(false)}
        >
          Kiểm tra thông tin chi tiết trong hệ thống.
        </Link>
      </>
    ),
    Contract_Customer_Confirmation:
      message?.contract?.leaseStatus === "Rejected" ? (
        <>
          <p>
            Khách hàng từ <b>{message?.contract?.customer?.companyName}</b> vừa
            phản hồi <b>từ chối</b> hợp đồng vì phát hiện sai sót dữ liệu.
          </p>
          <b>Những sai sót được họ nêu ra bao gồm:</b>
          <div>
            {message?.comment?.split("\n").map((x, index) => (
              <p key={index}>{x}</p>
            ))}
          </div>
          <Link
            to={`/dashboard/customer-contracts?openViewDetail=true&id=${message?.contract?.id}`}
            onClick={() => setOpenNotification(false)}
          >
            Kiểm tra thông tin chi tiết trong hệ thống.
          </Link>
        </>
      ) : (
        <>
          <p>
            Khách hàng từ <b>{message?.contract?.customer?.companyName}</b> vừa
            phản hồi <b>chấp nhận</b> hợp đồng. Vui lòng kiểm tra, gửi hợp đồng
            qua mail cho họ.
          </p>
          <b>Khách hàng có ghi chú thêm rằng:</b>
          <div>
            {message?.comment?.split("\n").map((x, index) => (
              <p key={index}>{x}</p>
            ))}
          </div>
          <Link
            to={`/dashboard/customer-contracts?openViewDetail=true&id=${message?.contract?.id}`}
            onClick={() => setOpenNotification(false)}
          >
            Kiểm tra thông tin chi tiết trong hệ thống.
          </Link>
        </>
      ),
  };

  const content = (
    <div className="flex flex-col gap-2">
      {notificationTypes[notificationDetails?.recipient?.type] || (
        <p>Không có thông báo phù hợp.</p>
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
