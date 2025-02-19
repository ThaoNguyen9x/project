package com.building_mannager_system.entity.customer_service.customer_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@FieldDefaults(level = AccessLevel.PACKAGE)
@Table(name = "customertypedocument")
public class CustomerTypeDocument extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Đảm bảo tự động tăng
    @Column(name = "CustomerDocumentId", nullable = false)
    private Integer Id;  // Khóa chính tự động tăng

    @Column(name = "DocumentType", nullable = false)
    private String documentType;  // Loại tài liệu

    @Column(name = "Status", nullable = false)
    private boolean status = true;  // Trạng thái (hoạt động hoặc không)

    @ManyToOne
    @JoinColumn(name = "CustomerTypeId", nullable = false)
    private CustomerType customerType;  // Liên kết với CustomerType

    @OneToMany(mappedBy = "customerTypeDocument", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CustomerDocument> customerDocuments;

    public CustomerTypeDocument(String documentType, CustomerType customerType) {
        this.documentType = documentType;
        this.customerType = customerType;
    }
}
