package com.building_mannager_system.mapper.notification;

import com.building_mannager_system.dto.requestDto.notificationDto.NotificationMaintenanceDto;
import com.building_mannager_system.entity.notification.NotificationMaintenance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NotificationMaintenanceMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

//  // Chuyển đổi từ Entity sang DTO
//    @Mapping(source = "id", target = "id")
//    @Mapping(source = "title", target = "title")
//    @Mapping(source = "message", target = "message")
//    @Mapping(source = "recipient", target = "recipient")
//    @Mapping(source = "status", target = "status")
//    @Mapping(source = "createdAt", target = "createdAt")
//    @Mapping(source = "maintenanceDate", target = "maintenanceDate")
//    @Mapping(source = "maintenanceTask.id",target = "taskId")
//
//    NotificationMaintenanceDto toDTO(NotificationMaintenance entity);
//
//    // Chuyển đổi từ DTO sang Entity
//    @Mapping(source = "id", target = "id")
//    @Mapping(source = "title", target = "title")
//    @Mapping(source = "message", target = "message")
//    @Mapping(source = "recipient", target = "recipient")
//    @Mapping(source = "status", target = "status")
//    @Mapping(source = "createdAt", target = "createdAt")
//    @Mapping(source = "maintenanceDate", target = "maintenanceDate")
//    @Mapping(source = "taskId",target = "maintenanceTask.id")
//    NotificationMaintenance toEntity(NotificationMaintenanceDto dto);
}
