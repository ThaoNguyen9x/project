package com.building_mannager_system.component;


import com.building_mannager_system.dto.requestDto.NotificationDto;
import com.building_mannager_system.dto.requestDto.verificationDto.ElectricityUsageVerificationDto;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.service.notification.NotificationService;
import com.building_mannager_system.service.notification.RecipientService;
import com.building_mannager_system.untils.JsonUntils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {
    private final ConcurrentHashMap<String, Boolean> onlineUsers = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RecipientService recipientService;

    // Constructor injection of SimpMessagingTemplate to send messages to clients
    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Lắng nghe sự kiện kết nối WebSocket (Online)
//    @EventListener
//    public void handleWebSocketConnectListener(SessionConnectEvent event) {
//       // String userId = getUserIdFromSession(event);
//        String contactId = "5"; // Lấy userId từ session
//
//       // String contactId = getContactIdFromSession(event);
//        int customer2 = 5;
//
//        if (contactId != null) {
//            Integer recipientId = Integer.parseInt(contactId);
//            // Lấy danh sách các Recipient theo referenceId
//            List<Recipient> recipients = recipientService.getRecipientByReferenceId(recipientId);
//
//            // Lặp qua từng Recipient và xử lý thông báo
//            for (Recipient recipient : recipients) {
//                // Lấy các thông báo chưa gửi từ DB cho từng Recipient
//                List<NotificationDto> pendingNotifications = notificationService.getNotificationsForRecipient(recipient.getId());
//
//                // Gửi từng thông báo tới client
//                for (NotificationDto notification : pendingNotifications) {
//                    // Assuming notification.getMessage() is a JSON String that you want to convert to an object
//                    String messageJson = notification.getMessage();
//
//                    try {
//                        // Convert the JSON string to the desired object (example: MessageObject.class)
//                        ElectricityUsageVerificationDto messageObject = JsonUntils.fromJson(messageJson, ElectricityUsageVerificationDto.class);
//
//                        // Now you can work with the `messageObject` instead of the plain String
//                        System.out.println("Converted message object: " + messageObject);
//
//                        // Sending the converted object to the client
//                        messagingTemplate.convertAndSend(
//                                "/topic/notifications/" + customer2,
//                                messageObject
//                        );
//                        System.out.println("/topic/notifications/" + customer2);
//                        System.out.println("Notification sent successfully to: " + customer2);
//
//                        // Save changes to the database
//                        notificationService.updateNotification(notification.getId()); // Save the updated notification
//                    } catch (IOException e) {
//                        // Handle any exceptions that occur during JSON parsing
//                        System.err.println("Error converting message to object: " + e.getMessage());
//                    }
//                }
//
//            }
//
//
//
//        }
//        messagingTemplate.convertAndSendToUser(
//                contactId,  // Use the session's contactId to target the specific client
//                "/queue/connection",  // Topic where clients can receive connection-related messages
//                "Connection successful and notifications sent."
//        );
//    }

    // Lắng nghe sự kiện ngắt kết nối WebSocket (Offline)
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
     String contactId = "5"; // Lấy userId từ session
        onlineUsers.remove(contactId); // Đánh dấu người dùng offline

        // Gửi thông báo khi người dùng offline
        messagingTemplate.convertAndSend("/topic/userStatus", contactId + " is offline");
        System.out.println(contactId + " is now offline");
    }


    // Lấy userId từ session hoặc token (sử dụng session events)
    private String getUserIdFromSession(SessionDisconnectEvent event) {
        if (event.getUser() != null) {
            return event.getUser().getName(); // Lấy tên người dùng từ event
        }
        return "Unknown";
    }



//    // Giả sử lấy userId từ session hoặc token
//    private String getUserIdFromSession(Object event) {
//        if (event instanceof SessionConnectEvent) {
//            return ((SessionConnectEvent) event).getUser().getName(); // Lấy tên người dùng
//        } else if (event instanceof SessionDisconnectEvent) {
//            return ((SessionDisconnectEvent) event).getUser().getName(); // Lấy tên người dùng
//        }
//        return "Unknown";
//    }

    // Kiểm tra người dùng online hay offline
    public boolean isUserOnline(String userId) {
        return onlineUsers.getOrDefault(userId, false);
    }
}
