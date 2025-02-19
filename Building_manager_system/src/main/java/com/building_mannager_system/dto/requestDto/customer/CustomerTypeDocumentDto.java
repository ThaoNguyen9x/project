package com.building_mannager_system.dto.requestDto.customer;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CustomerTypeDocumentDto {
    private Integer id;  // ID của tài liệu
    private String documentType;  // Loại tài liệu
    private boolean status;  // Trạng thái tài liệu
    private CustomerTypeDto customerType;  // ID của CustomerType
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
    // ✅ Constructor đầy đủ

    public CustomerTypeDocumentDto(Integer id, String documentType, boolean status,
                                   LocalDateTime createdAt, String createdBy, LocalDateTime updatedAt, String updatedBy) {
        this.id = id;
        this.documentType = documentType;
        this.status = status;

        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
    }

}
