package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.dto.requestDto.systemDto.SubcontractorDto;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemMaintenanceServiceDto {
    private Long id;
    private SubcontractorDto subcontractor;
    private String serviceType;
    private String maintenanceScope;
    private String frequency;
    private LocalDate nextScheduledDate;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
