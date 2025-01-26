package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.SystemMaintenanceServiceDto;
import com.building_mannager_system.entity.property_manager.SystemMaintenanceService;
import com.building_mannager_system.service.property_manager.SystemMaintenanceService_Service;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/system-maintenances")
public class SystemMaintenanceServiceController {
    private final SystemMaintenanceService_Service systemMaintenanceService;

    public SystemMaintenanceServiceController(SystemMaintenanceService_Service systemMaintenanceService) {
        this.systemMaintenanceService = systemMaintenanceService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách dịch vụ bảo trì thành công")
    public ResponseEntity<ResultPaginationDTO> getAllSystemMaintenanceServices(@Filter Specification<SystemMaintenanceService> spec,
                                                                    Pageable pageable) {
        return ResponseEntity.ok(systemMaintenanceService.getAllSystemMaintenanceServices(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo dịch vụ bảo trì thành công")
    public ResponseEntity<SystemMaintenanceServiceDto> createSystemMaintenanceService(@RequestBody SystemMaintenanceService subContractor) {
        return new ResponseEntity<>(systemMaintenanceService.createSystemMaintenanceService(subContractor), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy dịch vụ bảo trì thành công")
    public ResponseEntity<SystemMaintenanceServiceDto> getSystemMaintenanceService(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(systemMaintenanceService.getSystemMaintenanceService(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật dịch vụ bảo trì thành công")
    public ResponseEntity<SystemMaintenanceServiceDto> updateSystemMaintenanceService(@PathVariable(name = "id") Long id,
                                                                @RequestBody SystemMaintenanceService subContractor) {
        return ResponseEntity.ok(systemMaintenanceService.updateSystemMaintenanceService(id, subContractor));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa dịch vụ bảo trì thành công")
    public ResponseEntity<Void> deleteSystemMaintenanceService(@PathVariable(name = "id") Long id) {
        systemMaintenanceService.deleteSystemMaintenanceService(id);
        return ResponseEntity.ok(null);
    }
}
