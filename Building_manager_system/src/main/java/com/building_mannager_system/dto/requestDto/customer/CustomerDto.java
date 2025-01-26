package com.building_mannager_system.dto.requestDto.customer;

import com.building_mannager_system.entity.Role;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
        private String email;
        private String mobile;
        private Role role;
        private boolean status;
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;
    }
}
