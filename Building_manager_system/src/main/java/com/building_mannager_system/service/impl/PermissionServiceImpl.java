package com.building_mannager_system.service.impl;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.entity.Permission;
import com.building_mannager_system.repository.PermissionRepository;
import com.building_mannager_system.service.PermissionService;
import com.building_mannager_system.utils.exception.APIException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class PermissionServiceImpl implements PermissionService {
    private final PermissionRepository permissionRepository;

    public PermissionServiceImpl(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    public ResultPaginationDTO getAllPermissions(Specification<Permission> spec,
                                                 Pageable pageable) {

        Page<Permission> permission = permissionRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(permission.getTotalPages());
        mt.setTotal(permission.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(permission.getContent());

        return rs;
    }

    @Override
    public Permission createPermission(Permission permission) {
        if (permissionRepository.existsByNameAndApiPathAndMethodAndModule(permission.getName(), permission.getApiPath(), permission.getMethod(), permission.getModule()))
            throw new APIException(HttpStatus.BAD_REQUEST, "Đã tồn tại một quyền hạn cùng tên, API Path, method hoặc module");

        return permissionRepository.save(permission);
    }

    @Override
    public Permission getPermission(int id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Permission not found with ID: " + id));

        return permission;
    }

    @Override
    public Permission updatePermission(int id, Permission permission) {
        Permission ex = permissionRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Permission not found with ID: " + id));


        if (permissionRepository.existsByNameAndApiPathAndMethodAndModuleAndIdNot(permission.getName(), permission.getApiPath(), permission.getMethod(), permission.getModule(), id))
            throw new APIException(HttpStatus.BAD_REQUEST, "Đã tồn tại một quyền hạn cùng tên, API Path, method hoặc module");

        ex.setName(permission.getName());
        ex.setApiPath(permission.getApiPath());
        ex.setMethod(permission.getMethod());
        ex.setModule(permission.getModule());
        ex.setStatus(permission.isStatus());

        return permissionRepository.save(ex);
    }

    @Override
    public void deletePermission(int id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Permission not found with ID: " + id));

        permission.getRoles().forEach(role -> role.getPermissions().remove(permission));

        permissionRepository.delete(permission);
    }
}
