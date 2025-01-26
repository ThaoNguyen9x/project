package com.building_mannager_system.dto.requestDto.customer;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerTypeDocumentDto {
    private Integer id;  // ID của tài liệu
    private String documentType;  // Loại tài liệu
    private boolean status;  // Trạng thái tài liệu
    private CustomerTypeDto customerType;  // ID của CustomerType
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
