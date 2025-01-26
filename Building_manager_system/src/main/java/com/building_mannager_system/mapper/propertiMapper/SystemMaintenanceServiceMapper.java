package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.propertyDto.SystemMaintenanceServiceDto;
import com.building_mannager_system.entity.property_manager.SystemMaintenanceService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;


@Mapper(componentModel = "spring")
public interface SystemMaintenanceServiceMapper {


//    @Mapping(source = "subcontractor.id", target = "subcontractorId")
//    @Mapping(source = "subcontractor.name", target = "subcontractorName")
//    SystemMaintenanceServiceDto toDto(SystemMaintenanceService service);
//
//    @Mapping(source = "subcontractorId", target = "subcontractor.id")
//    SystemMaintenanceService toEntity(SystemMaintenanceServiceDto dto);
//
//    List<SystemMaintenanceServiceDto> toDtoList(List<SystemMaintenanceService> entities);
}
