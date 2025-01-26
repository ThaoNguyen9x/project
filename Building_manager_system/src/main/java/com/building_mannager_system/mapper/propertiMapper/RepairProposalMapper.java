package com.building_mannager_system.mapper.propertiMapper;


import com.building_mannager_system.dto.requestDto.propertyDto.RepairProposalDto;
import com.building_mannager_system.entity.property_manager.RepairProposal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RepairProposalMapper {
//    // Chuyển entity RepairProposal sang DTO
//    @Mapping(source = "riskAssessment.riskAssessmentID", target = "riskAssessmentId")  // Chuyển thông tin RiskAssessment sang chỉ ID
//    RepairProposalDto toDto(RepairProposal repairProposal);
//
//    // Chuyển DTO RepairProposalDto sang entity RepairProposal
//    @Mapping(source = "riskAssessmentId", target = "riskAssessment.riskAssessmentID")  // Chuyển ID của RiskAssessment sang entity
//    RepairProposal toEntity(RepairProposalDto repairProposalDto);
//
//    // Chuyển danh sách entity RepairProposal sang danh sách DTO
//    List<RepairProposalDto> toDtoList(List<RepairProposal> repairProposals);
//
//    // Chuyển danh sách DTO RepairProposalDto sang danh sách entity
//    List<RepairProposal> toEntityList(List<RepairProposalDto> repairProposalDtos);
}
