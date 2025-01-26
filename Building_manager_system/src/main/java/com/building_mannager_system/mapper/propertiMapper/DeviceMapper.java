package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto;
import com.building_mannager_system.entity.property_manager.Device;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeviceMapper {

//    @Mapping(source = "system.id",target = "systemId")
//    @Mapping(source = "location.id",target = "locationId")
//    @Mapping(source = "deviveType.id",target = "deviceTypeId")
//
//    DeviceDto toDto(Device device);
//
//    @Mapping(source = "systemId",target = "system.id")
//    @Mapping(source = "locationId",target = "location.id")
//    @Mapping(source = "deviceTypeId",target = "deviveType.id")
//
//    Device toEntity(DeviceDto dto);
//
//    List<DeviceDto> toDtoList(List<Device> devices);
}
