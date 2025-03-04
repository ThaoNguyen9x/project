package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.enums.DeviceStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDto {
    private Long deviceId;
    private SystemDto system;
    private LocationDto location;
    private DeviceTypeDto deviceType;
    private String deviceName;
    private LocalDate installationDate;
    private Integer lifespan;
    private int x;
    private int y;
    private DeviceStatus status;
    private SystemMaintenanceServiceDto maintenanceService;
    private List<RiskAssessment> riskAssessments;
    private List<ItemCheck> itemChecks;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskAssessment {
        private Integer riskAssessmentID;
        private LocalDate assessmentDate;
        private MaintenanceHistory maintenanceHistory;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaintenanceHistory {
        private Long id;
        private LocalDate performedDate;
    }

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
    public static class SubcontractorDto {
        private Integer id;
        private String name;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDto {
        private int id;
        private String floor;
        private List<OfficesDto> offices;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OfficesDto {
        private Integer id;
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceTypeDto {
        private Long id;
        private String typeName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemDto {
        private Long id;
        private String systemName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemCheck {
        private Long id;
        private String checkName;
    }
}
