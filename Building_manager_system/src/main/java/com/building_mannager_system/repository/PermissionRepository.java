package com.building_mannager_system.repository;

import com.building_mannager_system.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Integer>,
        JpaSpecificationExecutor<Permission> {

    Boolean existsByNameAndApiPathAndMethodAndModule(String name, String apiPath, String method, String module);

    Boolean existsByNameAndApiPathAndMethodAndModuleAndIdNot(String name, String apiPath, String method, String module, int id);

    List<Permission> findByIdIn(List<Integer> id);

    Optional<Permission> findByName(String name);
}
