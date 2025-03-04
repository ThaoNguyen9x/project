package com.building_mannager_system.dto.responseDto;


import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckResultRessponDto extends CheckResultDto {
    private String technicianName;
}
