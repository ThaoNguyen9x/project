package com.building_mannager_system.dto.requestDto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerBirthdayNotificationDto {
    private Integer id;
    private String companyName;
    private String email;
    private String phone;
    private String address;
    private String directorName;
    private LocalDate birthday;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
