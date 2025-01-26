package com.building_mannager_system.mapper.notification;


import com.building_mannager_system.dto.requestDto.verificationDto.RecipientDto;
import com.building_mannager_system.entity.notification.Recipient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RecipientMapper {
//    RecipientMapper INSTANCE = Mappers.getMapper(RecipientMapper.class);
//
//    // Chuyển từ Recipient sang RecipientDTO
//    @Mapping(source = "name", target = "name") // Enums are auto-mapped to String
//    RecipientDto toDTO(Recipient recipient);
//
//    // Chuyển từ RecipientDTO sang Recipient
//    @Mapping(source = "name", target = "name") // Enums are auto-mapped to String
//    Recipient toEntity(RecipientDto recipientDTO);
}
