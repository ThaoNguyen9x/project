package com.building_mannager_system.dto.requestDto.work_registration;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WorkRegistrationDto {
    private Long registrationID;
    private CustomerDto.User account;
    private LocalDateTime registrationDate;
    private LocalDateTime scheduledDate;
    private String status;
    private String note;
    private String drawingUrl; // Bản vẽ thi công
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
