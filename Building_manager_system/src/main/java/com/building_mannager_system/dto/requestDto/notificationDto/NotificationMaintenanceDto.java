package com.building_mannager_system.dto.requestDto.notificationDto;

import com.building_mannager_system.enums.StatusNotifi;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMaintenanceDto {
    private Long id;
    private String title;
    private String description;
    private StatusNotifi status = StatusNotifi.PENDING;
    private LocalDateTime maintenanceDate = LocalDateTime.now();
    private MaintenanceTaskDto maintenanceTask;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
