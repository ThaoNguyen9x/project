package com.building_mannager_system.dto.requestDto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatMessageDto {
    private Long id;
    private ChatRoom chatRoom;
    private User user;
    private String status;
    private String imageUrl;
    private String content;

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatRoom {
        private Long id;
        private String name;
        private Boolean isPrivate;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private int id;
        private String name;
        private Role role;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Role {
        private int id;
        private String name;
    }
}
