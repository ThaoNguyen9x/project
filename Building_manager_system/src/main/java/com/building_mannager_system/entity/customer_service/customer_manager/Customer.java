package com.building_mannager_system.entity.customer_service.customer_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor

@FieldDefaults(level = AccessLevel.PACKAGE)
@Table(name = "customer")
public class Customer extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerId", nullable = false)
    private Integer id;

    @Column(name = "CompanyName", nullable = false)
    private String companyName;

    @ManyToOne
    @JoinColumn(name = "CustomerTypeId")
    private CustomerType customerType;

    @Column(name = "Email")
    private String email;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Column(name = "Address")
    private String address;

    @Lob
    @Column(name = "Status")
    private String status;

    @Column(name = "DirectorName")
    private String directorName;

    @Column(name = "Birthday")
    private LocalDate birthday;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "customer")
    @JsonIgnore
    private List<Contract> contracts;
}
