package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.enums.ProposalStatus;
import com.building_mannager_system.enums.ProposalType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RepairProposalDto {
    private Long id;  // Mã đề xuất

    private String title;  // Tiêu đề của đề xuất

    private String description;  // Mô tả chi tiết của đề xuất

    private LocalDate requestDate;  // Ngày yêu cầu

    private Integer priority;  // Mức độ ưu tiên của đề xuất

    private ProposalType proposalType;  // Loại đề xuất (RiskAssessment hoặc Sự cố bất thường)

    private RiskAssessmentDto riskAssessment;  // ID của RiskAssessment nếu có

    private ProposalStatus status;  // Trạng thái của đề xuất (Pending, Approved, Rejected, Completed)

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskAssessmentDto {
        private Integer riskAssessmentID;
        private LocalDate assessmentDate;
    }
}
