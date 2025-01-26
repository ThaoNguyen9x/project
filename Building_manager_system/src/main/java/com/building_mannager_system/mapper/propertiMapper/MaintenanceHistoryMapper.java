package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.propertyDto.MaintenanceHistoryDto;
import com.building_mannager_system.entity.property_manager.MaintenanceHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MaintenanceHistoryMapper {


//    @Mapping(source = "maintenanceService.id", target = "maintenanceId")
//    MaintenanceHistoryDto toDto(MaintenanceHistory history);
//
//    @Mapping(source = "maintenanceId", target = "maintenanceService.id")
//
//    MaintenanceHistory toEntity(MaintenanceHistoryDto dto);
//
//
//    // Phương thức chuyển đổi từ danh sách entity sang danh sách DTO
//    // Phương thức chuyển đổi từ danh sách entity sang danh sách DTO
//    List<MaintenanceHistoryDto> toDtoList(List<MaintenanceHistory> histories);
}
