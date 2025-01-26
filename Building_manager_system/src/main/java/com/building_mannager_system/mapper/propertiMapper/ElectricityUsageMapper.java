package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.propertyDto.ElectricityUsageDTO;
import com.building_mannager_system.entity.customer_service.system_manger.ElectricityUsage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface ElectricityUsageMapper {

//
//    @Mapping(source = "meter.id", target = "meterId") // Ánh xạ id của Meter vào meterId trong DTO
//    ElectricityUsageDTO toDTO(ElectricityUsage electricityUsage);
//
//    @Mapping(source = "meterId", target = "meter.id") // Ánh xạ meterId từ DTO vào Meter
//    ElectricityUsage toEntity(ElectricityUsageDTO electricityUsageDTO);
//    // Update Existing Entity
//    @Mapping(target = "id", ignore = true) // Ignore ID during update
//    @Mapping(source = "meterId", target = "meter.id")
//    void updateEntity(ElectricityUsageDTO dto, @MappingTarget ElectricityUsage entity);
}
