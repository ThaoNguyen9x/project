package com.building_mannager_system.dto.responseDto;


import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.CommonAreaDto;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficeRequestDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class LocationResponseDto {
    private Long id;
    private String floor;
    private Integer numberFloor;
    private LocalDateTime createdAt;
    private double startX;
    private double startY;
    private double endX;
    private double endY;
    private double totalArea;
    private double commonArea;
    private double netArea;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private List<CommonAreaDto> commonAreas; // ✅ Thêm danh sách CommonArea
    private List<OfficeRequestDto> offices;
    private List<DeviceResponceDto>devices;
}
