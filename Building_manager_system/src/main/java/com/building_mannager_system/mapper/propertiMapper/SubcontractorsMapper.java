package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.systemDto.SubcontractorDto;
import com.building_mannager_system.entity.property_manager.Subcontractor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubcontractorsMapper {

//    @Mapping(source = "system.id", target = "systemId") // Map the System ID
//    SubcontractorDto toDto(Subcontractor subcontractor);
//
//
//    @Mapping(source = "systemId", target = "system.id") // Map the System ID
//    Subcontractor toEntity(SubcontractorDto subcontractorDto);
}
