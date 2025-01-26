package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.enums.QuotationStatus;
import lombok.*;

import java.math.BigDecimal;
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
}
