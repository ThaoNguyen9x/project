package com.building_mannager_system.mapper.propertiMapper;


import com.building_mannager_system.dto.requestDto.propertyDto.QuotationDto;
import com.building_mannager_system.entity.property_manager.Quotation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuotationMapper {
    // Chuyển từ Quotation entity sang QuotationDto
//    @Mapping(source = "id", target = "id")
//    @Mapping(source = "supplierName", target = "supplierName")
//    @Mapping(source = "totalAmount", target = "totalAmount")
//    @Mapping(source = "details", target = "details")
//    @Mapping(source = "fileName", target = "fileName")
//    @Mapping(source = "status", target = "status")
//    QuotationDto toDto(Quotation quotation);
//
//    // Chuyển từ QuotationDto sang Quotation entity
//    @Mapping(source = "id", target = "id")
//    @Mapping(source = "supplierName", target = "supplierName")
//    @Mapping(source = "totalAmount", target = "totalAmount")
//    @Mapping(source = "details", target = "details")
//    @Mapping(source = "fileName", target = "fileName")
//    @Mapping(source = "status", target = "status")
//    Quotation toEntity(QuotationDto quotationDto);
//
//    // Chuyển từ danh sách Quotation entity sang danh sách QuotationDto
//    List<QuotationDto> toDtoList(List<Quotation> quotations);
//
//    // Chuyển từ danh sách QuotationDto sang danh sách Quotation entity
//    List<Quotation> toEntityList(List<QuotationDto> quotationDtos);
}
