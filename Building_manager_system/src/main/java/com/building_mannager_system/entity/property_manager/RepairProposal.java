package com.building_mannager_system.entity.property_manager;


import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.enums.ProposalStatus;
import com.building_mannager_system.enums.ProposalType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "repair_proposal")
public class RepairProposal extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Mã đề xuất

    @Column(name = "title", nullable = false)
    private String title;  // Tiêu đề của đề xuất

    @Column(name = "description", nullable = false)
    private String description;  // Mô tả chi tiết của đề xuất

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;  // Ngày yêu cầu

    @Column(name = "priority", nullable = false)
    private Integer priority;  // Mức độ ưu tiên của đề xuất

    @Enumerated(EnumType.STRING)
    @Column(name = "proposal_type", nullable = false)
    private ProposalType proposalType;  // Loại đề xuất (RiskAssessment hoặc Sự cố bất thường)

    @ManyToOne
    @JoinColumn(name = "risk_assessment_id")
    private RiskAssessment riskAssessment;  // Liên kết đến bảng RiskAssessment (nếu có)

    @OneToMany(mappedBy = "repairProposal", cascade = CascadeType.ALL)
    private List<Quotation> quotations;  // Danh sách báo giá liên quan đến đề xuất

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProposalStatus status;  // Trạng thái của đề xuất (Pending, Approved, Rejected, Completed)
}
