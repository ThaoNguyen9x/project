package com.building_mannager_system.dto.requestDto.notificationDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.enums.MaintenanceType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceTaskDto {
    private Long id;
    private String taskName;
    private String taskDescription;
    private MaintenanceType maintenanceType; // Loại bảo trì (Định kỳ / Sự cố đột xuất)
    private CustomerDto.User assignedTo; // Người thực hiện công việc
    private String assignedToPhone; // Số điện thoại của người thực hiện công việc
    private Integer expectedDuration; // Thời gian dự kiến hoàn thành công việc (phút)
    //    private List<Long> notificationIds; // Danh sách ID thông báo bảo trì
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
