package com.building_mannager_system.service.impl;

import com.building_mannager_system.entity.Permission;
import com.building_mannager_system.entity.Role;
import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.repository.PermissionRepository;
import com.building_mannager_system.repository.RoleRepository;
import com.building_mannager_system.service.RoleService;
import com.building_mannager_system.utils.exception.APIException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleServiceImpl(RoleRepository roleRepository,
                           PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public ResultPaginationDTO getAllRoles(Specification<Role> spec,
                                           Pageable pageable) {

        Page<Role> role = roleRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(role.getTotalPages());
        mt.setTotal(role.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(role.getContent());

        return rs;
    }

    @Override
    public Role createRole(Role role) {
        if (roleRepository.existsByName(role.getName())) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên vai trò này đã được sử dụng");
        }

        if (role.getPermissions() != null) {
            List<Integer> permissions = role.getPermissions()
                    .stream().map(x -> x.getId())
                    .collect(Collectors.toList());

            List<Permission> dbPermissions = permissionRepository.findByIdIn(permissions);
            role.setPermissions(dbPermissions);
        }

        return roleRepository.save(role);
    }

    @Override
    public Role getRole(int id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Role not found with ID: " + id));

        return role;
    }

    @Override
    public Role updateRole(int id, Role role) {
        Role ex = roleRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Role not found with ID: " + id));

        if (roleRepository.existsByNameAndIdNot(role.getName(), id)) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên vai trò này đã được sử dụng");
        }

        if (role.getPermissions() != null) {
            List<Integer> permissions = role.getPermissions()
                    .stream().map(x -> x.getId())
                    .collect(Collectors.toList());

            List<Permission> dbPermissions = permissionRepository.findByIdIn(permissions);
            role.setPermissions(dbPermissions);
        }

        ex.setName(role.getName());
        ex.setStatus(role.isStatus());
        ex.setPermissions(role.getPermissions());

        return roleRepository.save(ex);
    }

    @Override
    public void deleteRole(int id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Role not found with ID: " + id));
        roleRepository.delete(role);
    }
}
