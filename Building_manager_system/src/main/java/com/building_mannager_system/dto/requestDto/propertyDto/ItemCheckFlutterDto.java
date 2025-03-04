package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemCheckFlutterDto {
    private Long id;
    private Long deviceId;
    private String checkCategory;
    private String checkName;
    private String standard;
    private String frequency;
}