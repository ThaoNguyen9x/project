package com.building_mannager_system.service.notification;

import com.building_mannager_system.component.WebSocketEventListener;
import com.building_mannager_system.dto.requestDto.paymentDto.PaymentContractDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.entity.verification.ElectricityUsageVerification;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.untils.JsonUntils;
import com.building_mannager_system.utils.exception.APIException;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationPaymentContractService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final RecipientService recipientService;
    private final UserRepository userRepository;

    public NotificationPaymentContractService(SimpMessagingTemplate messagingTemplate,
                                              NotificationService notificationService,
                                              RecipientService recipientService,
                                              UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.notificationService = notificationService;
        this.recipientService = recipientService;
        this.userRepository = userRepository;
    }

    // Gửi thông báo thanh toán đến khách hàng
    public void sendPaymentRequestNotificationToCustomer(PaymentContractDto paymentContractDto) {

        User user = userRepository.findById(paymentContractDto.getContract().getCustomer().getUser().getId())
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            String message = JsonUntils.toJson(paymentContractDto);
            Recipient rec = new Recipient();

            rec.setType("Contact");
            rec.setName("Send payment request");
            rec.setReferenceId(user.getId()); // Reference ID có thể là contactId hoặc ID của đối tượng liên quan

            Recipient recipient = recipientService.createRecipient(rec);

            Notification notification = new Notification();
            notification.setRecipient(recipient);
            notification.setMessage(message);

            notification.setStatus(StatusNotifi.PENDING); // Đánh dấu là PENDING
            notification.setCreatedAt(LocalDateTime.now());

            notificationService.createNotification(notification); // Lưu thông báo vào cơ sở dữ liệu

            messagingTemplate.convertAndSend(

                    "/topic/paymentNotifications/" + user.getId(),
                    paymentContractDto
            );
            System.out.println("Notification sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error sending notification to customer: " + e.getMessage());
        }
    }

    // Gửi thông báo thanh toán thành công đến khách hàng
    public void sendPaymentConfirmationToCustomer(PaymentContract paymentContract, int customerId) {
        messagingTemplate.convertAndSend("/user/" + customerId + "/queue/paymentNotifications", paymentContract);
    }

    // Gửi thông báo xác nhận sử dụng điện đến khách hàng
    public void sendElectricityUsageVerificationNotification(int contactId, ElectricityUsageVerification verificationElectricityUsageDto) {

        User user = userRepository.findById(contactId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            String message = JsonUntils.toJson(verificationElectricityUsageDto);
            Recipient rec = new Recipient();

            rec.setName("Contact");
            rec.setType("Electricity_Usage_Verification");
            rec.setReferenceId(contactId);

            Recipient recipient = recipientService.createRecipient(rec);

            Notification notification = new Notification();
            notification.setRecipient(recipient);
            notification.setMessage(message);

            notification.setStatus(StatusNotifi.PENDING);
            notification.setCreatedAt(LocalDateTime.now());

            notificationService.createNotification(notification);
            messagingTemplate.convertAndSend("/topic/electricityUsageVerification/" + user.getId(), verificationElectricityUsageDto);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error sending electricity usage verification notification to customer: " + e.getMessage());
        }
    }
}
