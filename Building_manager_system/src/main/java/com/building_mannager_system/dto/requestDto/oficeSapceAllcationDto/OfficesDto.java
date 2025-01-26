package com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfficesDto {
    private Integer id;
    private String name;
    private LocationDto location;
    private BigDecimal area;
    private BigDecimal rentPrice;
    private BigDecimal serviceFee;
    private String status;
    private String drawingFile;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
