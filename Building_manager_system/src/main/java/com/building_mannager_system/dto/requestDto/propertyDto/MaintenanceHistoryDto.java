package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceHistoryDto {
    private Long id;
    private SystemMaintenanceServiceDto maintenanceService;
    private LocalDate performedDate;
    private String notes;
    private User technician;
    private List<RiskAssessmentDto> riskAssessments;
    private String findings;
    private String resolution;
    private String phone;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemMaintenanceServiceDto {
        private Long id;
        private SubcontractorDto subcontractor;
        private String serviceType;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private Integer id;
        private String name;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskAssessmentDto {
        private Integer riskAssessmentID;
        private LocalDate assessmentDate;
        private SubcontractorDto contractor;
        private String systemType;
        private DeviceDto device;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceDto {
        private Long deviceId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubcontractorDto {
        private Integer id;
        private String name;
    }
}
