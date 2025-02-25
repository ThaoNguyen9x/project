package com.building_mannager_system.repository.account;

import com.building_mannager_system.entity.account.PageFlutter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PageFlutterRepository extends JpaRepository<PageFlutter, Integer> {

    @Query("SELECT p FROM PageFlutter p JOIN p.rolePages rp WHERE rp.role.id = :roleId ORDER BY p.route")
    List<PageFlutter> findPageFlutterByRoleIdOrderByRoute(@Param("roleId") Integer roleId);
}
