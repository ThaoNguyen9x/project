package com.building_mannager_system.entity.property_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "maintenance_history")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MaintenanceHistory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "maintenance_id")
    private SystemMaintenanceService maintenanceService;

    private LocalDate performedDate = LocalDate.now();

    private String notes;

    @ManyToOne
    @JoinColumn(name = "technician")
    private User technician;

    private String phone;

    private String findings;

    private String resolution;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "maintenanceHistory")
    @JsonIgnore
    private List<RiskAssessment> riskAssessments;
}
