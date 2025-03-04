package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckResultFlutterDto {
    private Long id;
    private Long checkItemId;
    private Integer technicianId ;
    private String result;
    private String note;
    private LocalDateTime checkedAt;
}
