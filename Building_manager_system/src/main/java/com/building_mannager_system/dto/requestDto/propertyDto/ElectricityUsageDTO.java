package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ElectricityUsageDTO {
    private Integer id;
    private MeterDto meter; // Thêm meterId vào DTO
    private BigDecimal startReading;
    private BigDecimal endReading;
    private BigDecimal usageAmount;
    private BigDecimal electricityRate;
    private BigDecimal electricityCost;
    private LocalDate readingDate;
    private String imageName;
    private String comments;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    private Integer electricityId;
    private BigDecimal previousMonthElectricityCost;
    private BigDecimal previousMonthUsageAmount;
    private LocalDate previousMonthReadingDate;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MeterDto {
        private Integer id;
        private String serialNumber;
        private OfficesDto office; // Id của văn phòng (nếu có)
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OfficesDto {
        private Integer id;
        private String name;
        private LocationDto location;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDto {
        private int id;
        private String floor;
    }
}
