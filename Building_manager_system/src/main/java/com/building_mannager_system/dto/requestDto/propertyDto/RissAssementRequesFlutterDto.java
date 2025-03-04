package com.building_mannager_system.dto.requestDto.propertyDto;

import jakarta.validation.constraints.Max;
import  jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.*;


@Getter
@Setter
public class RissAssementRequesFlutterDto {
    @NotNull( message="maintenanceID không được null")
    private Integer maintenanceID; // Foreign Key (MaintenanceHistory)

    @NotNull(message = "contractorID không được null")
    private Integer contractorID; // Foreign Key (Subcontractor)



    @NotNull(message = "riskProbability không được null")
    @Min(value = 1, message = "riskProbability phải >= 1")
    @Max(value = 10, message = "riskProbability phải <= 10")
    private Integer riskProbability; // 1-10

    @NotNull(message = "riskImpact không được null")
    @Min(value = 1, message = "riskImpact phải >= 1")
    @Max(value = 10, message = "riskImpact phải <= 10")
    private Integer riskImpact; // 1-10

    @NotNull(message = "riskDetection không được null")
    @Min(value = 1, message = "riskDetection phải >= 1")
    @Max(value = 10, message = "riskDetection phải <= 10")
    private Integer riskDetection; // 1-10

    private Integer riskPriorityNumber; // Computed field (can be calculated in service layer)

    private String mitigationAction; // Proposed action

    private String remarks; // Additional comments
}
