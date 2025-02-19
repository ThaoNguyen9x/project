package com.building_mannager_system.dto.responseDto;

import com.building_mannager_system.enums.DeviceStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
public class DeviceResponceDto {
    private Long deviceId;
    private Long systemId;
    private Long maintenanceServiceId;
    private String systemName;
    private String locationFloor;
    private String deviceTypeName;
    private String deviceName;
    private LocalDate installationDate;
    private Integer lifespan;
    private DeviceStatus status;
}
