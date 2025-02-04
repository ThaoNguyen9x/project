package com.building_mannager_system.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {

    private final ConcurrentHashMap<String, Boolean> onlineUsers = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // ✅ Sự kiện khi kết nối thành công (User Online)
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        String contactId = getUserIdFromSessionConnect(event);
        if (contactId != null && !contactId.equals("Unknown")) {
            onlineUsers.put(contactId, true);
            messagingTemplate.convertAndSend("/topic/userStatus", contactId + " is online");
            System.out.println(contactId + " is now online");
        }
    }

    // ✅ Sự kiện khi ngắt kết nối (User Offline)
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String contactId = getUserIdFromSessionDisconnect(event);
        if (contactId != null && !contactId.equals("Unknown")) {
            onlineUsers.remove(contactId);
            messagingTemplate.convertAndSend("/topic/userStatus", contactId + " is offline");
            System.out.println(contactId + " is now offline");
        }
    }

    // ✅ Tách biệt phương thức lấy userId cho ConnectEvent
    private String getUserIdFromSessionConnect(SessionConnectEvent event) {
        if (event.getUser() != null) {
            return event.getUser().getName();
        }
        return "Unknown";
    }

    // ✅ Tách biệt phương thức lấy userId cho DisconnectEvent
    private String getUserIdFromSessionDisconnect(SessionDisconnectEvent event) {
        if (event.getUser() != null) {
            return event.getUser().getName();
        }
        return "Unknown";
    }

    // ✅ Kiểm tra trạng thái online
    public boolean isUserOnline(String userId) {
        return onlineUsers.getOrDefault(userId, false);
    }
}