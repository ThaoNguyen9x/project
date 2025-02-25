package com.building_mannager_system.service.account;

import com.building_mannager_system.entity.account.RolesPageFlutter;

import java.util.List;

public interface RolePageService {
    void assignPagesToRole(List<RolesPageFlutter> rolePages);
    List<RolesPageFlutter> getPagesByRole(int roleId);
    void removePageFromRole(int rolePageId);
}
