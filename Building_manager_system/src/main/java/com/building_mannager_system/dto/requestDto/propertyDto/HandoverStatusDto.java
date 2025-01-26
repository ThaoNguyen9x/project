package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HandoverStatusDto {
    private Integer id;
    private OfficesDto office; // Map only the ID of the Office
    private LocalDate handoverDate;
    private String status;
    private String drawingFile;
    private String equipmentFile;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
