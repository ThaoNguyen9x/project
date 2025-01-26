package com.building_mannager_system.controller;

import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.responseDto.ResUserDTO;
import com.building_mannager_system.service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách tài khoản thành công")
    public ResponseEntity<ResultPaginationDTO> getAllUsers(@Filter Specification<User> spec,
                                                            Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(spec, pageable));
    }

    @GetMapping("/used")
    @ApiMessage("Lấy danh sách tài khoản đã dùng thành công")
    public ResponseEntity<ResultPaginationDTO> getAllUsersUsed(@Filter Specification<User> spec,
                                                              Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsersUsed(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo tài khoản thành công")
    public ResponseEntity<ResUserDTO> createUser(@RequestBody User user) {
        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy tài khoản thành công")
    public ResponseEntity<ResUserDTO> getUser(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật tài khoản thành công")
    public ResponseEntity<ResUserDTO> updateUser(@PathVariable(name = "id") int id,
                                              @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa tài khoản thành công")
    public ResponseEntity<Void> deleteUser(@PathVariable(name = "id") int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(null);
    }
}
