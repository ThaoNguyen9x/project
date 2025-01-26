package com.building_mannager_system.mapper.notification;


import com.building_mannager_system.dto.requestDto.NotificationDto;
import com.building_mannager_system.entity.notification.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    // Entity to DTO mapping
    @Mapping(source = "recipient", target = "recipient")

    NotificationDto toDto(Notification notification);

//    // DTO to Entity mapping
//    @Mapping(source = "recipientId", target = "recipient.id")
//    @Mapping(source = "status", target = "status")
//    Notification toEntity(NotificationDto notificationDto);
//
//
//    // Map Notification entity to NotificationDTO
//    NotificationDto toNotificationDTO(Notification notification);

}
