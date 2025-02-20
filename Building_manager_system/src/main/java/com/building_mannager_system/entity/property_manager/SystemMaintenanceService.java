package com.building_mannager_system.entity.property_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.enums.MaintenanceFrequency;
import com.building_mannager_system.enums.MaintenanceStatus;
import com.building_mannager_system.enums.ServiceType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "system_maintenance_services")
public class SystemMaintenanceService extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subcontractor_id")
    private Subcontractor subcontractor;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    private String maintenanceScope;

    @Enumerated(EnumType.STRING)
    private MaintenanceFrequency frequency;

    private LocalDate nextScheduledDate;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status = MaintenanceStatus.PENDING;

    @OneToMany(mappedBy = "maintenanceService", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Device> devices;

    public SystemMaintenanceService(Subcontractor subcontractor, ServiceType serviceType, String maintenanceScope, MaintenanceFrequency frequency, String nextScheduledDate) {
        this.subcontractor = subcontractor;
        this.serviceType = serviceType;
        this.maintenanceScope = maintenanceScope;
        this.frequency = frequency;
        this.nextScheduledDate = LocalDate.parse(nextScheduledDate);
    }
}
