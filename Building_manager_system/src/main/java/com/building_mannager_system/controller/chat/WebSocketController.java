package com.building_mannager_system.controller.chat;

import com.building_mannager_system.entity.User;
import com.building_mannager_system.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.concurrent.ConcurrentHashMap;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    private static final ConcurrentHashMap<String, String> userStatus = new ConcurrentHashMap<>();

    public WebSocketController(SimpMessagingTemplate messagingTemplate, UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    @MessageMapping("/user-status")
    public void updateUserStatus(String message) {
        JSONObject json = new JSONObject(message);

        Object userIdObj = json.get("userId");
        String userId = String.valueOf(userIdObj);

        String status = json.getString("status");

        userStatus.put(userId, status);

        User user = userRepository.findById(Integer.parseInt(userId)).orElse(null);
        if (user != null) {
            user.setIsOnline("online".equals(status));
            userRepository.save(user);
        }

        messagingTemplate.convertAndSend("/topic/user-status", userStatus);
    }
}