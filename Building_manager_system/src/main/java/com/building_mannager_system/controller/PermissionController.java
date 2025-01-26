package com.building_mannager_system.controller;

import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import com.building_mannager_system.entity.Permission;
import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.service.PermissionService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {
    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách quyền truy cập thành công")
    public ResponseEntity<ResultPaginationDTO> getAllPermissions(@Filter Specification<Permission> spec,
                                                            Pageable pageable) {
        return ResponseEntity.ok(permissionService.getAllPermissions(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo quyền truy cập thành công")
    public ResponseEntity<Permission> createPermission(@RequestBody Permission permission) {
        return new ResponseEntity<>(permissionService.createPermission(permission), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy quyền truy cập thành công")
    public ResponseEntity<Permission> getPermission(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(permissionService.getPermission(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật quyền truy cập thành công")
    public ResponseEntity<Permission> updatePermission(@PathVariable(name = "id") int id,
                                              @RequestBody Permission permission) {
        return ResponseEntity.ok(permissionService.updatePermission(id, permission));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa quyền truy cập thành công")
    public ResponseEntity<Void> deletePermission(@PathVariable(name = "id") int id) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok(null);
    }
}
