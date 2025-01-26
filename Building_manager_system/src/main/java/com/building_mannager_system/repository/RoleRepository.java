package com.building_mannager_system.repository;

import com.building_mannager_system.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RoleRepository extends JpaRepository<Role, Integer>,
        JpaSpecificationExecutor<Role> {

    Boolean existsByName(String name);

    Boolean existsByNameAndIdNot(String name, int id);

    Role findByName(String name);
}
