package com.building_mannager_system.entity.customer_service.customer_manager;

import com.building_mannager_system.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "contact")
public class Contact extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ContactID", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerId")
    private Customer customer;

    @Column(name = "ContactName", nullable = false)
    private String contactName;

    @Column(name = "ContactEmail")
    private String contactEmail;

    @Column(name = "ContactPhone", length = 20)
    private String contactPhone;

    @Column(name = "Position")
    private String position;

}
