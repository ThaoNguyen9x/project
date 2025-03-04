package com.building_mannager_system.dto.requestDto.propertyDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddRiskAssessmentAndMaintenanceHistoryRequestDto {
    @NotNull(message = "RissAssessmentRequesFlutterDto không được null")
    @Valid
    private RissAssementRequesFlutterDto rissAssessmentRequesFlutterDto;

    @NotNull(message = "MaintenanceRepuestFlutterDto không được null")
    @Valid
    private MaintenanceRepuestFlutterDto maintenanceRepuestFlutterDto;
}
