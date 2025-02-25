package com.building_mannager_system.dto.requestDto.customer;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {
    private Integer id;
    private String companyName;
    private CustomerTypeDto customerType;  // This will store the customerType ID
    private String email;
    private String phone;
    private String address;
    private String status;
    private String directorName;
    private LocalDate birthday;
    private User user;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private Integer id;
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerTypeDto {
        private int id;
        private String typeName;
        private List<CustomerTypeDocumentDto> customerTypeDocuments;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerTypeDocumentDto {
        private Integer id;  // ID của tài liệu
        private String documentType;  // Loại tài liệu
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
    }
}
