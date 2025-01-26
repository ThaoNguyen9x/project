package com.building_mannager_system.service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.entity.Role;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface RoleService {

    ResultPaginationDTO getAllRoles(Specification<Role> spec, Pageable pageable);

    Role createRole(Role role);

    Role getRole(int id);

    Role updateRole(int id, Role role);

    void deleteRole(int id);
}
