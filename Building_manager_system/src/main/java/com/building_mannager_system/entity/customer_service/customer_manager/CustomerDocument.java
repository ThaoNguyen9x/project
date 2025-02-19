package com.building_mannager_system.entity.customer_service.customer_manager;

import com.building_mannager_system.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customer_document")
public class CustomerDocument extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerDocumentId", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "CustomerId", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "CustomerTypeDocumentId",nullable = false)
    private CustomerTypeDocument customerTypeDocument;

    @Column(name = "FilePath")
    private String filePath; // Đường dẫn file (nếu có)

    @Column(name = "IsApproved", nullable = false)
    private boolean isApproved = false; // true = đã duyệt, false = chưa duyệt
}
