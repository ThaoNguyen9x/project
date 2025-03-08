package com.building_mannager_system.controller;

import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import com.building_mannager_system.entity.Role;
import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.service.RoleService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách vai trò thành công")
    public ResponseEntity<ResultPaginationDTO> getAllRoles(@Filter Specification<Role> spec,
                                                            Pageable pageable) {
        return ResponseEntity.ok(roleService.getAllRoles(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo vai trò thành công")
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        return new ResponseEntity<>(roleService.createRole(role), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy vai trò thành công")
    public ResponseEntity<Role> getRole(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(roleService.getRole(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật vai trò thành công")
    public ResponseEntity<Role> updateRole(@PathVariable(name = "id") int id,
                                              @RequestBody Role role) {
        return ResponseEntity.ok(roleService.updateRole(id, role));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa vai trò thành công")
    public ResponseEntity<Void> deleteRole(@PathVariable(name = "id") int id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(null);
    }
}
