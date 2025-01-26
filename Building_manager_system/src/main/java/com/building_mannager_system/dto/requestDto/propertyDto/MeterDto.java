package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MeterDto {
    private Integer id;
    private String serialNumber;
    private String meterType; // Loại đồng hồ (Một pha / Ba pha)
    private LocalDate installationDate; // Ngày lắp đặt
    private OfficesDto office; // Id của văn phòng (nếu có)
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
