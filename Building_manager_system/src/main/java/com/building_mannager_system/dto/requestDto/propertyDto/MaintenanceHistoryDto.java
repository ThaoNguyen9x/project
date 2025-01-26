package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceHistoryDto {
    private Long id;
    private SystemMaintenanceServiceDto maintenanceService;
    private LocalDate performedDate;
    private String notes;
    private CustomerDto.User technician;
    private String findings;
    private String resolution;
    private String phone;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
