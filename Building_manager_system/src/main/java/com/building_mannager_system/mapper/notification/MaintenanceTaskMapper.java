package com.building_mannager_system.mapper.notification;

import com.building_mannager_system.dto.requestDto.notificationDto.MaintenanceTaskDto;
import com.building_mannager_system.entity.notification.NotificationMaintenance;
import com.building_mannager_system.entity.property_manager.MaintenanceTask;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring" )
public interface MaintenanceTaskMapper {

//    @Mapping(source = "notifications", target = "notificationIds", qualifiedByName = "notificationToIds")
//    MaintenanceTaskDto toDTO(MaintenanceTask maintenanceTask);
//
//    @Mapping(source = "notificationIds", target = "notifications", qualifiedByName = "idsToNotification")
//    MaintenanceTask toEntity(MaintenanceTaskDto maintenanceTaskDto);
//
//    // Phương thức để chuyển List<NotificationMaintenance> thành List<Long>
//    @Named("notificationToIds")
//    default List<Long> mapNotificationsToIds(List<NotificationMaintenance> notifications) {
//        if (notifications == null) {
//            return Collections.emptyList();
//        }
//        return notifications.stream()
//                .map(NotificationMaintenance::getId) // Lấy ID của mỗi thông báo
//                .collect(Collectors.toList());
//    }
//
//    // Phương thức để chuyển List<Long> thành List<NotificationMaintenance>
//    @Named("idsToNotification")
//    default List<NotificationMaintenance> mapIdsToNotifications(List<Long> notificationIds) {
//        if (notificationIds == null) {
//            return Collections.emptyList();
//        }
//        return notificationIds.stream()
//                .map(id -> {
//                    NotificationMaintenance notification = new NotificationMaintenance();
//                    notification.setId(id);
//                    return notification; // Bạn cần phải xử lý thêm logic để ánh xạ đúng
//                })
//                .collect(Collectors.toList());
//    }
}
