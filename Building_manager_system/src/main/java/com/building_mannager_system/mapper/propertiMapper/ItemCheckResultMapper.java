package com.building_mannager_system.mapper.propertiMapper;

import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultDto;
import com.building_mannager_system.entity.property_manager.ItemCheckResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ItemCheckResultMapper {
    // Map từ Entity sang DTO
    @Mapping(source = "itemCheck.id", target = "itemCheck.id") // Lấy ID từ `ItemCheck`
    CheckResultDto toDto(ItemCheckResult entity);

    // Map từ DTO sang Entity
    @Mapping(source = "itemCheck.id", target = "itemCheck.id") // Gán ID của `ItemCheck`
    ItemCheckResult toEntity(CheckResultDto dto);
}