package com.building_mannager_system.controller.notificationController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.NotificationDto;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.service.notification.NotificationService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/topic/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách thông báo thành công")
    public ResponseEntity<ResultPaginationDTO> getAllNotifications(@Filter Specification<Notification> spec,
                                                           Pageable pageable) {
        return ResponseEntity.ok(notificationService.getAllNotifications(spec, pageable));
    }

    @PutMapping("/{id}")
    @ApiMessage("Thay đổi thông báo thành công")
    public ResponseEntity<NotificationDto> readNotification(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(notificationService.readNotification(id));
    }
}
