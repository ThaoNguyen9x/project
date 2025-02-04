package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.LocationDto;
import com.building_mannager_system.dto.requestDto.systemDto.SystemDto;
import com.building_mannager_system.enums.DeviceStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private DeviceStatus status;
    private SystemMaintenanceServiceDto maintenanceService;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
