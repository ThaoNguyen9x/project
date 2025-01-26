package com.building_mannager_system.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificationDto {
    private Integer id;
    private Recipient recipient; // ID of the recipient
    private String message; // Notification content
    private String status; // Status as a string
    private LocalDateTime createdAt; // Notification creation time
    private LocalDateTime sentAt; // Notification sent time

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Recipient {
        private Integer id;
        private Integer referenceId;
        private String type;
        private String name;
    }
}
