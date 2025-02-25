package com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfficesDto {
    private Integer id;
    private String name;
    private LocationDto location;
    private BigDecimal totalArea;
    private BigDecimal rentPrice;
    private BigDecimal serviceFee;
    private double startX;
    private double startY;
    private double endX;
    private double endY;
    private String status;
    private String drawingFile;
    private List<ContractDto> contracts;
    private List<HandoverStatusDto> handoverStatuses;
    private List<MeterDto> meters;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDto {
        private Integer id;
        private String floor;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HandoverStatusDto {
        private Integer id;
        private LocalDate handoverDate;
        private String status;
        private String drawingFile;
        private String equipmentFile;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContractDto {
        private Integer id;
        private CustomerDto customer;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDto {
        private Integer id;
        private String companyName;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MeterDto {
        private Integer id;
        private String serialNumber;
    }
}
