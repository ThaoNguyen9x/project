package com.building_mannager_system.entity.customer_service.contact_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "office")
public class Office extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OfficeId", nullable = false)
    private Integer id;

    private String name;

    @ManyToOne()
    @JoinColumn(name = "LocationId")
    private Location location;

    @Column(name = "Area", precision = 15, scale = 2)
    private BigDecimal area;

    @Column(name = "RentPrice", precision = 15, scale = 2)
    private BigDecimal rentPrice;

    @Column(name = "ServiceFee", precision = 15, scale = 2)
    private BigDecimal serviceFee;

    @Lob
    @Column(name = "Status")
    private String status;

    @Column(name = "DrawingFile")
    private String drawingFile;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "office")
    @JsonIgnore
    private List<Meter> meters = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "office")
    @JsonIgnore
    private List<Contract> contracts;
}