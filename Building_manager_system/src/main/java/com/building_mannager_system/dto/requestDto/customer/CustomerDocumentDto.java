package com.building_mannager_system.dto.requestDto.customer;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDocumentDto {
    private Integer id;
    private CustomerDto customer;
    private CustomerTypeDocumentDto customerTypeDocument;

    private String filePath;
    private boolean isApproved;

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDto {
        private Integer id;
        private String companyName;
        private String email;
        private String phone;
        private String address;
        private String status;
        private String directorName;
        private LocalDate birthday;
        private com.building_mannager_system.dto.requestDto.customer.CustomerDto.User user;
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;
    }
}
