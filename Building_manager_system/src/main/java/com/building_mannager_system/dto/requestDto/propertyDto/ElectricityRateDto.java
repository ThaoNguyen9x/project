package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ElectricityRateDto {
    private Integer id;
    private String tierName;
    private Integer minUsage;
    private Integer maxUsage;
    private Double rate;
}
