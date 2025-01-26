package com.building_mannager_system.mapper.contractMapper;


import com.building_mannager_system.dto.requestDto.ContractDto.ContractDto;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ContractMapper {

    ContractMapper INSTANCE = Mappers.getMapper(ContractMapper.class);


//    @Mapping(source = "office.id", target = "office")
//    @Mapping(source = "customer.id", target = "customer")
//    ContractDto toDto(Contract contract);
//
//    @Mapping(source = "office", target = "office.id")
//    @Mapping(source = "customer", target = "customer.id")
//    Contract toEntity(ContractDto contractDto);




}
