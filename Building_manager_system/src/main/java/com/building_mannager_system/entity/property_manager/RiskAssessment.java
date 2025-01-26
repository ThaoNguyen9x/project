package com.building_mannager_system.entity.property_manager;


import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.enums.ServiceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "riskAssessment")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RiskAssessment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer riskAssessmentID;

    @ManyToOne
    @JoinColumn(name = "maintenanceID", nullable = false)
    private MaintenanceHistory maintenanceHistory;

    @ManyToOne
    @JoinColumn(name = "contractorID", nullable = false)
    private Subcontractor contractor;

    @Enumerated(EnumType.STRING)
    private ServiceType systemType; // ENUM: Electrical, HVAC, Plumbing, etc.

    @ManyToOne
    @JoinColumn(name = "deviceID", nullable = false)
    private Device device;

    private LocalDate assessmentDate; // Date of risk assessment

    @Column(nullable = false)
    private Integer riskProbability; // 1-10

    @Column(nullable = false)
    private Integer riskImpact; // 1-10

    @Column(nullable = false)
    private Integer riskDetection; // 1-10

    @Column(nullable = false)
    private Integer riskPriorityNumber; // Computed as Probability × Impact × Detection

    @Column(columnDefinition = "TEXT")
    private String mitigationAction; // Proposed mitigation action

    @Column(columnDefinition = "TEXT")
    private String remarks; // Additional comments
}
