package com.building_mannager_system.mapper.customerMapper;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
//    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);
//
//    // Mapping Customer entity to CustomerDto
//    @Mapping(source = "customerType.id", target = "customerTypeId")  // Mapping customerType to customerTypeId
//    CustomerDto toDto(Customer customer);
//
//    // Mapping CustomerDto to Customer entity
//    @Mapping(source = "customerTypeId", target = "customerType.id")  // Mapping customerTypeId to customerType
//    Customer toEntity(CustomerDto customerDto);
//
//    // Ánh xạ từ danh sách Customer sang danh sách CustomerDto
//    List<CustomerDto> toListDto(List<Customer> customerList);

}
