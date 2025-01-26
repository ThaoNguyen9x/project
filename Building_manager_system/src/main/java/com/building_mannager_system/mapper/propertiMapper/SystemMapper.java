package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.systemDto.SystemDto;
import com.building_mannager_system.entity.property_manager.Systems;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SystemMapper {


//    @Mapping(source = "id", target = "systemId")
//    @Mapping(source = "description", target = "description")
//    @Mapping(source = "systemName", target = "systemName")
//    @Mapping(source = "maintenanceCycle", target = "maintenanceCycle")
//    @Mapping(source = "subcontractors", target = "subcontractors")
//    SystemDto toDTO(Systems system);
//
//    @Mapping(source = "systemId", target = "id")
//    @Mapping(source = "description", target = "description")
//    @Mapping(source = "systemName", target = "systemName")
//    @Mapping(source = "maintenanceCycle", target = "maintenanceCycle")
//    @Mapping(source = "subcontractors", target = "subcontractors")
//    Systems toEntity(SystemDto systemDto);
}