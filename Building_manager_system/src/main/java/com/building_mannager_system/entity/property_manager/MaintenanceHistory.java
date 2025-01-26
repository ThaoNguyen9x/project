package com.building_mannager_system.entity.property_manager;


import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

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

    private LocalDate performedDate;

    private String notes;

    @ManyToOne
    @JoinColumn(name = "technician")
    private User technician;

    private String phone;

    private String findings;

    private String resolution;
}
