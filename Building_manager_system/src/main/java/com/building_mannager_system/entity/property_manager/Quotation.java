package com.building_mannager_system.entity.property_manager;


import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.enums.QuotationStatus;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "quotation")
public class Quotation extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Mã báo giá

    @ManyToOne
    @JoinColumn(name = "repair_proposal_id", nullable = false)
    private RepairProposal repairProposal;  // Liên kết đến bảng RepairProposal

    @Column(name = "supplier_name", nullable = false)
    private String supplierName;  // Tên nhà cung cấp

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;  // Tổng số tiền báo giá

    @Column(name = "details", nullable = false)
    private String details;  // Chi tiết các hạng mục báo giá

    @Column(name = "file_name")
    private String fileName;  // Tên file báo giá (nếu có)

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private QuotationStatus status;  // Trạng thái báo giá (Pending, Approved, Rejected)
}
