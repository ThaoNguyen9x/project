package com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto;

import com.building_mannager_system.enums.DeviceStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LocationDto {
    private int id;
    private String floor;
    private Integer numberFloor;
    private double totalArea;
    private double commonArea;
    private double netArea;
    private double startX;
    private double startY;
    private double endX;
    private double endY;
    private List<CommonAreaDto> commonAreas;
    private List<DeviceDto> devices;
    private List<OfficesDto> offices;

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommonAreaDto {
        private Long id;
        private String name;
        private String color;
        private double startX;
        private double startY;
        private double endX;
        private double endY;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceDto {
        private Long deviceId;
        private com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto.SystemDto system;
        private com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto.DeviceTypeDto deviceType;
        private String deviceName;
        private LocalDate installationDate;
        private Integer lifespan;
        private DeviceStatus status;
        private int x;
        private int y;
        private com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto.SystemMaintenanceServiceDto maintenanceService;
        private List<com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto.RiskAssessment> riskAssessments;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OfficesDto {
        private Integer id;
        private String name;
        private double startX;
        private double startY;
        private double endX;
        private double endY;
        private String status;
    }
}