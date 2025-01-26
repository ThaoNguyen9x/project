package com.building_mannager_system.mapper.verificationMapper;

import com.building_mannager_system.dto.requestDto.verificationDto.ElectricityUsageVerificationDto;
import com.building_mannager_system.entity.verification.ElectricityUsageVerification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ElectricityUsageVerificationMapper {
//    // Convert from Entity to DTO
//    @Mapping(source = "meter.id", target = "meterId")  // Ánh xạ meter.id sang meterId trong DTO
//    @Mapping(source = "status", target = "status")      // Enum sẽ được ánh xạ tự động
//    @Mapping(source = "usageAmountPreviousMonth", target = "usageAmountPreviousMonth")  // Ánh xạ lượng điện sử dụng tháng trước
//    @Mapping(source = "usageAmountCurrentMonth", target = "usageAmountCurrentMonth")  // Ánh xạ lượng điện sử dụng tháng hiện tại
//    ElectricityUsageVerificationDto toDTO(ElectricityUsageVerification entity);
//
//    // Convert from DTO to Entity
//    @Mapping(source = "meterId", target = "meter.id")  // Ánh xạ meterId sang meter.id
//    @Mapping(source = "status", target = "status")     // Ánh xạ status từ DTO vào Entity
//    @Mapping(source = "usageAmountPreviousMonth", target = "usageAmountPreviousMonth")  // Ánh xạ tháng trước
//    @Mapping(source = "usageAmountCurrentMonth", target = "usageAmountCurrentMonth")    // Ánh xạ tháng hiện tại
//    ElectricityUsageVerification toEntity(ElectricityUsageVerificationDto dto);
//
//    // Map một danh sách các entity sang danh sách DTOs
//    List<ElectricityUsageVerificationDto> toDTOList(List<ElectricityUsageVerification> entities);
//
//    // Map một danh sách DTOs sang danh sách entity
//    List<ElectricityUsageVerification> toEntityList(List<ElectricityUsageVerificationDto> dtos);
}
