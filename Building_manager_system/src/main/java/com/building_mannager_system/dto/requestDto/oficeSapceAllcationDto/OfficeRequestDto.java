package com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter

public class OfficeRequestDto {
    private Integer id;  // ID (nếu có để cập nhật)
    private String name;
    private Integer locationId;  // Chỉ lưu `locationId` thay vì toàn bộ object
    private double startX;
    private double startY;
    private double endX;
    private double endY;
    private BigDecimal rentPrice;
    private BigDecimal serviceFee;
    private String drawingFile;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}


