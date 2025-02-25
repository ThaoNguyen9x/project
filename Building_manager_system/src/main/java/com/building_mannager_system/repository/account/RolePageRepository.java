package com.building_mannager_system.repository.account;

import com.building_mannager_system.entity.account.RolesPageFlutter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePageRepository  extends JpaRepository<RolesPageFlutter, Integer> {

    List<RolesPageFlutter> findByRoleId(Integer roleId);
}
