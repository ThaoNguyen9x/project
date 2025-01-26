package com.building_mannager_system.controller.notificationController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.notificationDto.NotificationMaintenanceDto;
import com.building_mannager_system.entity.notification.NotificationMaintenance;
import com.building_mannager_system.service.notification.NotificationMaintenanceService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationMaintenanceController {
    private final NotificationMaintenanceService notificationMaintenanceService;

    public NotificationMaintenanceController(NotificationMaintenanceService notificationMaintenanceService) {
        this.notificationMaintenanceService = notificationMaintenanceService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách thông báo bảo trì thành công")
    public ResponseEntity<ResultPaginationDTO> getAllNotificationMaintenances(@Filter Specification<NotificationMaintenance> spec,
                                                              Pageable pageable) {
        return ResponseEntity.ok(notificationMaintenanceService.getAllNotifications(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo thông báo bảo trì thành công")
    public ResponseEntity<NotificationMaintenanceDto> createNotificationMaintenance(@RequestBody NotificationMaintenance contact) {
        return new ResponseEntity<>(notificationMaintenanceService.createNotification(contact), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy thông báo bảo trì thành công")
    public ResponseEntity<NotificationMaintenanceDto> getNotificationMaintenance(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(notificationMaintenanceService.getNotification(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật thông báo bảo trì thành công")
    public ResponseEntity<NotificationMaintenanceDto> updateNotificationMaintenance(@PathVariable(name = "id") Long id,
                                                    @RequestBody NotificationMaintenance notificationMaintenance) {
        return ResponseEntity.ok(notificationMaintenanceService.updateNotification(id, notificationMaintenance));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa thông báo bảo trì thành công")
    public ResponseEntity<Void> deleteNotificationMaintenance(@PathVariable(name = "id") Long id) {
        notificationMaintenanceService.deleteNotification(id);
        return ResponseEntity.ok(null);
    }

    @PutMapping("/change-status/{id}")
    @ApiMessage("Thay đổi thông báo bảo trì thành công")
    public ResponseEntity<NotificationMaintenanceDto> updateChangeStatus(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(notificationMaintenanceService.updateStatus(id));
    }
}
