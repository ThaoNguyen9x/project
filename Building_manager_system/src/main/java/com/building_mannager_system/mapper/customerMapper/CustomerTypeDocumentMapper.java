package com.building_mannager_system.mapper.customerMapper;

import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDocumentDto;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerTypeDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerTypeDocumentMapper {

//    // Mapping từ Entity sang DTO
//    @Mapping(source = "customerType.id", target = "customerTypeId")
//    CustomerTypeDocumentDto toDto(CustomerTypeDocument customertypeDocument);
//
//    // Mapping từ DTO sang Entity
//    @Mapping(source = "customerTypeId", target = "customerType.id")
//    CustomerTypeDocument toEntity(CustomerTypeDocumentDto customertypeDocumentDto);
//
//    List<CustomerTypeDocumentDto> toDtoList(List<CustomerTypeDocument> customertypeDocuments);
//
//    List<CustomerTypeDocument> toEntityList(List<CustomerTypeDocumentDto> customertypeDocumentDtos);
}


