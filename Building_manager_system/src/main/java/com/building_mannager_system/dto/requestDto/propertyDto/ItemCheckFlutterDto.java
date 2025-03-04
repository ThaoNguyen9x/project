package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemCheckDto {
    private Long id;
    private DeviceDto device;
    private String checkCategory;
    private String checkName;
    private String standard;
    private String frequency;

    private List<ItemCheckResult> itemCheckResults;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DeviceDto {
        private Long deviceId;
        private String deviceName;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemCheckResult {
        private Long id;
        private String result;
    }
}