package com.building_mannager_system.dto.requestDto.ContractDto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ContractDto {
    private Integer id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String leaseStatus;
    private OfficesDto office;
    private CustomerDto customer;
    private BigDecimal totalAmount;
    private String fileName;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OfficesDto {
        private Integer id;
        private String name;
        private BigDecimal totalArea;
        private BigDecimal rentPrice;
        private BigDecimal serviceFee;
        private double startX;
        private double startY;
        private double endX;
        private double endY;
        private String status;
        private String drawingFile;
        private LocationDto location;
        private List<HandoverStatusDto> handoverStatuses;
        private List<MeterDto> meters;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MeterDto {
        private Integer id;
        private String serialNumber;
        private String meterType;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HandoverStatusDto {
        private Integer id;
        private String drawingFile;
        private String equipmentFile;
        private String status;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDto {
        private int id;
        private String floor;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDto {
        private Integer id;
        private String companyName;
        private com.building_mannager_system.dto.requestDto.customer.CustomerDto.CustomerTypeDto customerType;
        private String email;
        private String phone;
        private String address;
        private String status;
        private String directorName;
        private LocalDate birthday;
        private User user;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private Integer id;
        private String name;
        private String email;
        private String mobile;
        private boolean status;
        private Role role;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Role {
        private Integer id;
        private String name;
    }
}
