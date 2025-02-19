package com.building_mannager_system.dto.requestDto.ContractDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.LocationDto;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import com.building_mannager_system.dto.requestDto.propertyDto.MeterDto;
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
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;
        private List<com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto.HandoverStatusDto> handoverStatuses;

        private List<MeterDto> meters;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MeterDto {
        private Integer id;
        private String serialNumber;
        private String meterType; // Loại đồng hồ (Một pha / Ba pha)
        private LocalDate installationDate; // Ngày lắp đặt
        private LocalDateTime createdAt;
        private String createdBy;
        private LocalDateTime updatedAt;
        private String updatedBy;
    }
}
