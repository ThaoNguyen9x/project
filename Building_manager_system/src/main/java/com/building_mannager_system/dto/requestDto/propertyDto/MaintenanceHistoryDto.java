package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.dto.requestDto.systemDto.SubcontractorDto;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceHistoryDto {
    private Long id;
    private SystemMaintenanceServiceDto maintenanceService;
    private LocalDate performedDate;
    private String notes;
    private CustomerDto.User technician;
    private List<RiskAssessmentDto> riskAssessments;
    private String findings;
    private String resolution;
    private String phone;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;


    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskAssessmentDto {
        private Integer riskAssessmentID;
        private SubcontractorDto contractor;
        private String systemType;
        private DeviceDto device;
        private LocalDate assessmentDate;
        private Integer riskProbability;
        private Integer riskImpact;
        private Integer riskDetection;
        private Integer riskPriorityNumber;
        private String mitigationAction;
        private String remarks;
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;
    }
}
