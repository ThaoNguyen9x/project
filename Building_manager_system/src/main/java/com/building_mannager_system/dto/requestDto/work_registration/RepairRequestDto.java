package com.building_mannager_system.dto.requestDto.work_registration;

import com.building_mannager_system.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RepairRequestDto {
    private Long requestID;
    private UserDto account;
    private UserDto technician;
    private LocalDateTime requestDate;
    private String content;
    private RequestStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private int id;
        private String name;
        private CustomerDto customer;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDto {
        private int id;
        private String companyName;
    }
}
