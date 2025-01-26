package com.building_mannager_system.dto.requestDto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatRoomUserDto {
    private Long id;
    private ChatRoom chatRoom;
    private User user;
    private long unreadCount;
    private LocalDateTime joinedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private int id;
        private String email;
        private String name;
        private Boolean isOnline;
        private boolean status;
        private Role role;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatRoom {
        private Long id;
        private String name;
        private Boolean isPrivate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Role {
        private int id;
        private String name;
    }
}
