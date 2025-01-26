package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddRiskAssessmentAndMaintenanceHistoryRequestDto {
    private RiskAssessmentDto riskAssessmentDto;  // DTO cho RiskAssessment
    private MaintenanceHistoryDto maintenanceHistoryDto;  // DTO cho MaintenanceHistory
}
