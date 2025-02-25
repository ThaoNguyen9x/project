package com.building_mannager_system.controller.account;

import com.building_mannager_system.entity.account.RolesPageFlutter;
import com.building_mannager_system.service.account.RolePageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role-pages")
public class RolePageController {
    private final RolePageService rolePageService;

    public RolePageController(RolePageService rolePageService) {
        this.rolePageService = rolePageService;
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignPagesToRole(@RequestBody List<RolesPageFlutter> rolePages) {
        rolePageService.assignPagesToRole(rolePages);
        return ResponseEntity.ok("Pages assigned to role successfully!");
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<RolesPageFlutter>> getPagesByRole(@PathVariable int roleId) {
        List<RolesPageFlutter> rolePages = rolePageService.getPagesByRole(roleId);
        return ResponseEntity.ok(rolePages);
    }

    @DeleteMapping("/remove/{rolePageId}")
    public ResponseEntity<String> removePageFromRole(@PathVariable int rolePageId) {
        rolePageService.removePageFromRole(rolePageId);
        return ResponseEntity.ok("Page removed from role successfully!");
    }
}
