package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.propertyDto.MeterDto;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MeterMapper {
//    MeterMapper INSTANCE = Mappers.getMapper(MeterMapper.class);
//
//    @Mapping(source = "office.id", target = "officeId") // Ánh xạ id của Office sang officeId trong DTO
//    @Mapping(source = "meterType", target = "type")
//    MeterDto toDTO(Meter meter);
//
//    @Mapping(source = "officeId", target = "office.id") // Ánh xạ officeId từ DTO về Office
//   @Mapping(source = "type", target = "meterType")
//    Meter toEntity(MeterDto meterDTO);
}
