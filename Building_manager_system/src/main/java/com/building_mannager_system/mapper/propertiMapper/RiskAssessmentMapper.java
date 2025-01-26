package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.propertyDto.RiskAssessmentDto;
import com.building_mannager_system.entity.property_manager.RiskAssessment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RiskAssessmentMapper {
//    @Mapping(source = "maintenanceHistory.id", target = "maintenanceID")
//    @Mapping(source = "contractor.id", target = "contractorID")
//    @Mapping(source = "device.deviceId", target = "deviceID")
//    RiskAssessmentDto toDto(RiskAssessment entity);
//
//    @Mapping(source = "maintenanceID", target = "maintenanceHistory.id")
//    @Mapping(source = "contractorID", target = "contractor.id")
//    @Mapping(source = "deviceID", target = "device.deviceId")
//    RiskAssessment toEntity(RiskAssessmentDto dto);
//
//    List<RiskAssessmentDto> toDtoList(List<RiskAssessment> entities);
}
