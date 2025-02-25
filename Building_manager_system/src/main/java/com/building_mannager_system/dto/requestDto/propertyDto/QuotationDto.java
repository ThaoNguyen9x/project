package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.enums.ProposalStatus;
import com.building_mannager_system.enums.ProposalType;
import com.building_mannager_system.enums.QuotationStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuotationDto {
    private Long id;  // Mã báo giá
    private String supplierName;  // Tên nhà cung cấp
    private BigDecimal totalAmount;  // Tổng số tiền báo giá
    private String details;  // Chi tiết các hạng mục báo giá
    private String fileName;  // Tên file báo giá (nếu có)
    private QuotationStatus status;  // Trạng thái báo giá (Pending, Approved, Rejected)
    private RepairProposalDto repairProposal;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RepairProposalDto {
        private Long id;  // Mã đề xuất
        private String title;  // Tiêu đề của đề xuất
        private String description;
        private LocalDate requestDate;
        private Integer priority;
        private ProposalType proposalType;
        private RiskAssessmentDto riskAssessment;
        private String status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskAssessmentDto {
        private Integer riskAssessmentID;
        private LocalDate assessmentDate;
    }
}
