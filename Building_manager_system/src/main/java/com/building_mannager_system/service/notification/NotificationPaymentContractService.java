package com.building_mannager_system.service.notification;

import com.building_mannager_system.component.WebSocketEventListener;
import com.building_mannager_system.dto.requestDto.paymentDto.PaymentContractDto;
import com.building_mannager_system.dto.requestDto.propertyDto.QuotationDto;
import com.building_mannager_system.dto.requestDto.propertyDto.RepairProposalDto;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.dto.requestDto.work_registration.WorkRegistrationDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.entity.verification.ElectricityUsageVerification;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.untils.JsonUntils;
import com.building_mannager_system.utils.exception.APIException;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

    public void sendRepairRequestToCustomer(RepairRequestDto repairRequestDto) {
        User user = userRepository.findById(repairRequestDto.getAccount().getId())
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            String message = JsonUntils.toJson(repairRequestDto);

            List<String> roles = List.of("Application_Admin", "Technician_Manager");
            List<User> recipients = userRepository.findByRole_NameIn(roles);

            for (User admin : recipients) {
                Recipient adminRec = new Recipient();
                adminRec.setType("Repair_Request_Notification_Complete");
                adminRec.setName("Send Repair Request Notification Complete");
                adminRec.setReferenceId(admin.getId());

                Recipient savedAdminRec = recipientService.createRecipient(adminRec);

                Notification adminNoti = new Notification();
                adminNoti.setRecipient(savedAdminRec);
                adminNoti.setMessage(message);
                adminNoti.setStatus(StatusNotifi.PENDING);
                adminNoti.setCreatedAt(LocalDateTime.now());

                notificationService.createNotification(adminNoti);

                messagingTemplate.convertAndSend("/topic/repair-request-notifications/" + admin.getId(), message);
            }

            Recipient customerRec = new Recipient();
            customerRec.setType("Repair_Request_Notification_Customer");
            customerRec.setName("Send Repair Request Notification");
            customerRec.setReferenceId(user.getId());

            Recipient savedCustomerRec = recipientService.createRecipient(customerRec);

            Notification customerNoti = new Notification();
            customerNoti.setRecipient(savedCustomerRec);
            customerNoti.setMessage(message);
            customerNoti.setStatus(StatusNotifi.PENDING);
            customerNoti.setCreatedAt(LocalDateTime.now());

            notificationService.createNotification(customerNoti);

            messagingTemplate.convertAndSend("/topic/repair-request-notifications/" + user.getId(), message);
            System.out.println("Notification sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error sending notification to customer: " + e.getMessage());
        }
    }

    public void sendWorkRegistrationToCustomer(WorkRegistrationDto workRegistrationDto) {
        User user = userRepository.findById(workRegistrationDto.getAccount().getId())
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            String message = JsonUntils.toJson(workRegistrationDto);

            List<String> roles = List.of("Technician_Manager", "Technician_Employee");
            List<User> recipients = userRepository.findByRole_NameIn(roles);

            for (User admin : recipients) {
                Recipient adminRec = new Recipient();
                adminRec.setType("Work_Register_Notification_Customer");
                adminRec.setName("Send Work RegisterNotification");
                adminRec.setReferenceId(admin.getId());

                Recipient savedAdminRec = recipientService.createRecipient(adminRec);

                Notification adminNoti = new Notification();
                adminNoti.setRecipient(savedAdminRec);
                adminNoti.setMessage(message);
                adminNoti.setStatus(StatusNotifi.PENDING);
                adminNoti.setCreatedAt(LocalDateTime.now());

                notificationService.createNotification(adminNoti);

                messagingTemplate.convertAndSend("/topic/work-registration-notifications/" + admin.getId(), message);
            }

            Recipient rec = new Recipient();

            rec.setType("Work_Register_Notification_Customer");
            rec.setName("Send Work RegisterNotification");
            rec.setReferenceId(user.getId());

            Recipient recipient = recipientService.createRecipient(rec);

            Notification notification = new Notification();
            notification.setRecipient(recipient);
            notification.setMessage(message);
            notification.setStatus(StatusNotifi.PENDING);
            notification.setCreatedAt(LocalDateTime.now());

            notificationService.createNotification(notification);

            messagingTemplate.convertAndSend(
                    "/topic/work-registration-notifications/" + user.getId(),
                    workRegistrationDto
            );
            System.out.println("Notification sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error sending notification to customer: " + e.getMessage());
        }
    }

    public void sendRepairProposal(QuotationDto quotationDto) {
        try {
            List<String> roles = List.of("Technician_Employee");
            List<User> recipients = userRepository.findByRole_NameIn(roles);

            if (recipients.isEmpty()) {
                return;
            }

            String message;
            try {
                message = JsonUntils.toJson(quotationDto);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error converting quotationDto to JSON", e);
            }

            LocalDateTime timestamp = LocalDateTime.now();

            for (User user : recipients) {
                Recipient recipient = new Recipient();
                recipient.setType("Repair_Proposal_Notification_Verification");
                recipient.setName("Send Repair Proposal Notification Verification");
                recipient.setReferenceId(user.getId());

                recipient = recipientService.createRecipient(recipient);

                Notification notification = new Notification();
                notification.setRecipient(recipient);
                notification.setMessage(message);
                notification.setStatus(StatusNotifi.PENDING);
                notification.setCreatedAt(timestamp);

                notificationService.createNotification(notification);

                messagingTemplate.convertAndSend("/topic/repair-proposal-notifications/" + user.getId(), message);
            }
        } catch (Exception e) {
            System.err.println("Error sending notification to technicians: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendPaymentSuccess(PaymentContractDto paymentContractDto) {
        try {
            List<String> roles = List.of("Application_Admin");
            List<User> recipients = userRepository.findByRole_NameIn(roles);

            if (recipients.isEmpty()) {
                return;
            }

            String message;
            try {
                message = JsonUntils.toJson(paymentContractDto);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error converting quotationDto to JSON", e);
            }

            LocalDateTime timestamp = LocalDateTime.now();

            for (User user : recipients) {
                Recipient recipient = new Recipient();
                recipient.setType("Payment_Notification_Success");
                recipient.setName("Send Payment Notification Success");
                recipient.setReferenceId(user.getId());

                recipient = recipientService.createRecipient(recipient);

                Notification notification = new Notification();
                notification.setRecipient(recipient);
                notification.setMessage(message);
                notification.setStatus(StatusNotifi.PENDING);
                notification.setCreatedAt(timestamp);

                notificationService.createNotification(notification);

                messagingTemplate.convertAndSend("/topic/payment-notifications/" + user.getId(), message);
            }
        } catch (Exception e) {
            System.err.println("Error sending notification to technicians: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
