package com.building_mannager_system.mapper.officeMapper;


import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OfficeMapper {
    // Map Office entity to DTO
//    @Mapping(target = "locationId", source = "location.id")  // Map Location's id to locationId in DTO
//    OfficesDto toDto(Office office);
//
//    // Map Office DTO to entity
//    @Mapping(target = "location.id", source = "locationId")  // Map locationId in DTO to Location's id in entity
//    Office toEntity(OfficesDto officeDto);
}
