package com.building_mannager_system.controller.contractController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.notificationDto.MaintenanceTaskDto;
import com.building_mannager_system.entity.property_manager.MaintenanceTask;
import com.building_mannager_system.service.notification.MaintenanceTaskService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class MaintenanceTaskController {
    private final MaintenanceTaskService maintenanceTaskService;

    public MaintenanceTaskController(MaintenanceTaskService maintenanceTaskService) {
        this.maintenanceTaskService = maintenanceTaskService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách nhiệm vụ bảo trì thành công")
    public ResponseEntity<ResultPaginationDTO> getAllMaintenanceTasks(@Filter Specification<MaintenanceTask> spec,
                                                               Pageable pageable) {
        return ResponseEntity.ok(maintenanceTaskService.getAllMaintenanceTasks(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo nhiệm vụ bảo trì thành công")
    public ResponseEntity<MaintenanceTaskDto> createMaintenanceTask(@RequestBody MaintenanceTask maintenanceTask) {
        return new ResponseEntity<>(maintenanceTaskService.createMaintenanceTask(maintenanceTask), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy nhiệm vụ bảo trì thành công")
    public ResponseEntity<MaintenanceTaskDto> getMaintenanceTask(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(maintenanceTaskService.getMaintenanceTask(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật nhiệm vụ bảo trì thành công")
    public ResponseEntity<MaintenanceTaskDto> updateMaintenanceTask(@PathVariable(name = "id") Long id,
                                                      @RequestBody MaintenanceTask maintenanceTask) {
        return ResponseEntity.ok(maintenanceTaskService.updateMaintenanceTask(id, maintenanceTask));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa nhiệm vụ bảo trì thành công")
    public ResponseEntity<Void> deleteMaintenanceTask(@PathVariable(name = "id") Long id) {
        maintenanceTaskService.deleteMaintenanceTask(id);
        return ResponseEntity.ok(null);
    }
}
