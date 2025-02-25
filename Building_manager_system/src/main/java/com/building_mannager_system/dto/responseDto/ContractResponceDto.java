package com.building_mannager_system.dto.responseDto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponceDto {
        private Integer id;
        private LocalDate startDate;
        private LocalDate endDate;
        private String leaseStatus;
        private CustomerDto customer;
        private BigDecimal totalAmount;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDto {
        private Integer id;
        private String companyName;
        private UserDto user;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Integer id;
        private String name;
    }
}
