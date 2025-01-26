package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.propertyDto.DeviceTypeDto;
import com.building_mannager_system.entity.property_manager.DeviceType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DeviceTypeMapper {
    // Maps DeviceType entity to DeviceTypeDTO
//    DeviceTypeDto toDTO(DeviceType deviceType);
//
//    // Maps DeviceTypeDTO back to DeviceType entity
//    DeviceType toEntity(DeviceTypeDto deviceTypeDTO);
}
