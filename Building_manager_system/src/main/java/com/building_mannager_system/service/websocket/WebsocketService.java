package com.building_mannager_system.service.websocket;

import com.building_mannager_system.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebsocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebsocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Phương thức gửi thông báo qua WebSocket
    public void sendNotificationToRecipients(Integer userId, Object message) {
        try {
            messagingTemplate.convertAndSend(
                    "/topic/maintenance-task-notifications/" + userId,
                    message
            );
            System.out.println("Notification sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error sending notification to customer: " + e.getMessage());
        }
    }
}
