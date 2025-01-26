package com.building_mannager_system.mapper.customerMapper;


import com.building_mannager_system.dto.requestDto.customer.ContactDto;
import com.building_mannager_system.entity.customer_service.customer_manager.Contact;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContactMapper {
    ContactMapper INSTANCE = Mappers.getMapper(ContactMapper.class);

    // Mapping Customer to CustomerId (because Customer object should be avoided in the DTO)
    @Mapping(source = "customer.id", target = "customerId")
    ContactDto  toDTO(Contact contact);

    @Mapping(source = "customerId", target = "customer.id")
    Contact toEntity(ContactDto contact);
    List<ContactDto> toDto(List<Contact> contacts);
}
