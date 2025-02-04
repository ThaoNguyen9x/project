package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.*;

import java.time.LocalDateTime;

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

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
