package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.entity.property_manager.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceDetailDto {
    private Long id;
    private String specifications;
    private String manufacturer;
    private String deviceType;
    private Integer powerUsage;       // Cho FCU
    private Integer fanSpeed;         // Cho FCU
    private Integer flowRate;         // Cho Pump
    private Integer pressure;         // Cho Pump
    private Double sensitivity;       // Cho Fire Alarm
    private Double activationTemperature; // Cho Sprinkler
    private String pumpType;

    public DeviceDetailDto() {
    }

    public static DeviceDetailDto fromEntity(DeviceDetail detail) {
        DeviceDetailDto dto = new DeviceDetailDto();
        dto.setId(detail.getId());
        dto.setSpecifications(detail.getSpecifications());
        dto.setManufacturer(detail.getManufacturer());
        dto.setDeviceType(detail.getClass().getSimpleName());

        if (detail instanceof FcuDetail fcu) {
            dto.setPowerUsage(fcu.getPowerUsage());
            dto.setFanSpeed(fcu.getFanSpeed());
        } else if (detail instanceof PumpDetail pump) {
            dto.setFlowRate(pump.getFlowRate());
            dto.setPressure(pump.getPressure());
            dto.setPumpType(pump.getPumpType());
        } else if (detail instanceof FireAlarmDetail fireAlarm) {
            dto.setSensitivity(fireAlarm.getSensitivity());
        } else if (detail instanceof SprinklerDetail sprinkler) {
            dto.setActivationTemperature(sprinkler.getActivationTemperature());
        }

        return dto;
    }
}
