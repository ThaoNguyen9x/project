package com.building_mannager_system.entity.property_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.enums.DeviceStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Device extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deviceId;

    @ManyToOne
    @JoinColumn(name = "system_id")
    private Systems system;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    private String deviceName;

    private int x;

    private int y;

    private LocalDate installationDate;

    private Integer lifespan;

    @Enumerated(EnumType.STRING)
    private DeviceStatus status = DeviceStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "device_type_id", nullable = false)
    private DeviceType deviceType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maintenance_service_id")
    private SystemMaintenanceService maintenanceService;

    @OneToMany(mappedBy = "device", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ItemCheck> itemChecks;

    public Device(Systems system, Location location, String deviceName, int x, int y, String installationDate, Integer lifespan, DeviceType deviceType, SystemMaintenanceService maintenanceService) {
        this.system = system;
        this.location = location;
        this.deviceName = deviceName;
        this.x = x;
        this.y = y;
        this.installationDate = LocalDate.parse(installationDate);
        this.lifespan = lifespan;
        this.deviceType = deviceType;
        this.maintenanceService = maintenanceService;
    }
}
