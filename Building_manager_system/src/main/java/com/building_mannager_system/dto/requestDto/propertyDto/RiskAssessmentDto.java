package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.dto.requestDto.systemDto.SubcontractorDto;
import com.building_mannager_system.enums.DeviceStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RiskAssessmentDto {
    private Integer riskAssessmentID;
    private MaintenanceHistoryDto maintenanceHistory; // Foreign Key (MaintenanceHistory)
    private com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto.SubcontractorDto contractor; // Foreign Key (Subcontractor)
    private String systemType; // ENUM as String
    private DeviceDto device; // Foreign Key (Device)
    private LocalDate assessmentDate; // Date of assessment
    private Integer riskProbability; // 1-10
    private Integer riskImpact; // 1-10
    private Integer riskDetection; // 1-10
    private Integer riskPriorityNumber; // Computed field
    private String mitigationAction; // Proposed action
    private String remarks; // Comments
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaintenanceHistoryDto {
        private Long id;
        private LocalDate performedDate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceDto {
        private Long deviceId;
        private String deviceName;
    }
}
