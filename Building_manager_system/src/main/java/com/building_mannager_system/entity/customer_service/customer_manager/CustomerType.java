package com.building_mannager_system.entity.customer_service.customer_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "customertype")
public class CustomerType extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerTypeId", nullable = false)
    private Integer id;

    @Column(name = "TypeName")
    private String typeName;

    private boolean status = true;

    @OneToMany(mappedBy = "customerType", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CustomerTypeDocument> customerTypeDocuments;

    @OneToMany(mappedBy = "customerType", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Customer> customers;

    public CustomerType(String typeName) {
        this.typeName = typeName;
    }
}