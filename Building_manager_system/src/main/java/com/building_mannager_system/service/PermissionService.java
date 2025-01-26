package com.building_mannager_system.service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.entity.Permission;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface PermissionService {

    ResultPaginationDTO getAllPermissions(Specification<Permission> spec, Pageable pageable);

    Permission createPermission(Permission permission);

    Permission getPermission(int id);

    Permission updatePermission(int id, Permission permission);

    void deletePermission(int id);
}
