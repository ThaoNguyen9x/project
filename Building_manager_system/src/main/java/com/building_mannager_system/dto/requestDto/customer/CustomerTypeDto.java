package com.building_mannager_system.dto.requestDto.customer;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerTypeDto {
    private int id;
    private String typeName;
    private boolean status;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    private List<CustomerTypeDocumentDto> customerTypeDocuments;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerTypeDocumentDto {
        private Integer id;  // ID của tài liệu
        private String documentType;  // Loại tài liệu
        private boolean status;  // Trạng thái tài liệu
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;

        private List<CustomerDocumentDto> customerDocuments;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDocumentDto {
        private Integer id;
        private String filePath;
        private Integer customerId;
        private boolean isApproved;
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;
    }
}
