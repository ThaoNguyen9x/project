package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.systemDto.SystemDto;
import com.building_mannager_system.entity.property_manager.Systems;
import com.building_mannager_system.service.property_manager.SystemsService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/systems")
public class SystemsController {
    private final SystemsService systemsService;

    public SystemsController(SystemsService systemsService) {
        this.systemsService = systemsService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách hệ thống thành công")
    public ResponseEntity<ResultPaginationDTO> getAllSystems(@Filter Specification<Systems> spec,
                                                                Pageable pageable) {
        return ResponseEntity.ok(systemsService.getAllSystems(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo hệ thống thành công")
    public ResponseEntity<SystemDto> createSystem(@RequestBody Systems system) {
        return new ResponseEntity<>(systemsService.createSystem(system), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy hệ thống thành công")
    public ResponseEntity<SystemDto> getSystem(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(systemsService.getSystem(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật hệ thống thành công")
    public ResponseEntity<SystemDto> updateSystem(@PathVariable(name = "id") Long id,
                                                  @RequestBody Systems system) {
        return ResponseEntity.ok(systemsService.updateSystem(id, system));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa hệ thống thành công")
    public ResponseEntity<Void> deleteSystem(@PathVariable(name = "id") Long id) {
        systemsService.deleteSystem(id);
        return ResponseEntity.ok(null);
    }
}
