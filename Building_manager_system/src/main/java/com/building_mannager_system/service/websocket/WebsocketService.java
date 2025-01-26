package com.building_mannager_system.service.websocket;

import com.building_mannager_system.entity.User;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebsocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public WebsocketService(SimpMessagingTemplate messagingTemplate, UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    // Phương thức gửi thông báo qua WebSocket
    public void sendNotificationToRecipients(Integer userId, Object message) {
        try {
            messagingTemplate.convertAndSend(
                    "/topic/maintenance/" + userId,
                    message
            );
            System.out.println("Notification sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error sending notification to customer: " + e.getMessage());
        }
    }
}
