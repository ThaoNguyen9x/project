package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.MaintenanceHistoryDto;
import com.building_mannager_system.entity.property_manager.MaintenanceHistory;
import com.building_mannager_system.service.property_manager.MaintenanceHistoryService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance-histories")
public class MaintenanceHistoryController {
    private final MaintenanceHistoryService maintenanceHistoryService;

    public MaintenanceHistoryController(MaintenanceHistoryService maintenanceHistoryService) {
        this.maintenanceHistoryService = maintenanceHistoryService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách lịch sử bảo trì thành công")
    public ResponseEntity<ResultPaginationDTO> getAllMaintenanceHistories(@Filter Specification<MaintenanceHistory> spec,
                                                              Pageable pageable) {
        return ResponseEntity.ok(maintenanceHistoryService.getAllMaintenanceHistories(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo lịch sử bảo trì thành công")
    public ResponseEntity<MaintenanceHistoryDto> createMaintenanceHistory(@RequestBody MaintenanceHistory maintenanceHistory) {
        return new ResponseEntity<>(maintenanceHistoryService.createMaintenanceHistory(maintenanceHistory), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy lịch sử bảo trì thành công")
    public ResponseEntity<MaintenanceHistoryDto> getMaintenanceHistory(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(maintenanceHistoryService.getMaintenanceHistory(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật lịch sử bảo trì thành công")
    public ResponseEntity<MaintenanceHistoryDto> updateMaintenanceHistory(@PathVariable(name = "id") Long id,
                                                    @RequestBody MaintenanceHistory maintenanceHistory) {
        return ResponseEntity.ok(maintenanceHistoryService.updateMaintenanceHistory(id, maintenanceHistory));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa lịch sử bảo trì thành công")
    public ResponseEntity<Void> deleteMaintenanceHistory(@PathVariable(name = "id") Long id) {
        maintenanceHistoryService.deleteMaintenanceHistory(id);
        return ResponseEntity.ok(null);
    }
}
