package com.building_mannager_system.entity.property_manager;


import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.enums.ServiceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "subcontractors")

public class Subcontractor extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SubcontractorID")
    private int id;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "Phone", nullable = false, length = 100)
    private String phone;

    @Column(name = "ServiceType")
    private ServiceType serviceType; // bỏ

    @Column(name = "ContractStartDate")
    private LocalDate contractStartDate;

    @Column(name = "ContractEndDate")
    private LocalDate contractEndDate;

    @Column(name = "Rating", precision = 3, scale = 2)
    private BigDecimal rating;

    @ManyToOne
    @JoinColumn(name = "SystemID", nullable = false)
    private Systems system;
}
