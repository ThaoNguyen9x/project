package com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.dto.requestDto.propertyDto.MeterDto;
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
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

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
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContractDto {
        private Integer id;
        private LocalDate startDate;
        private LocalDate endDate;
        private String leaseStatus;
        private CustomerDto customer;
        private BigDecimal totalAmount;
        private String fileName;
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;
    }

}
