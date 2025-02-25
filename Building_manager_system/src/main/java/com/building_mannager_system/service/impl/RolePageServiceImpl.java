package com.building_mannager_system.service.impl;

import com.building_mannager_system.entity.account.RolesPageFlutter;
import com.building_mannager_system.repository.account.RolePageRepository;
import com.building_mannager_system.service.account.RolePageService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolePageServiceImpl implements RolePageService {
    private final RolePageRepository rolePageRepository;

    public RolePageServiceImpl(RolePageRepository rolePageRepository) {
        this.rolePageRepository = rolePageRepository;
    }

    @Override
    public void assignPagesToRole(List<RolesPageFlutter> rolePages) {
        rolePageRepository.saveAll(rolePages);
    }

    @Override
    public void removePageFromRole(int rolePageId) {
        rolePageRepository.deleteById(rolePageId);
    }

    @Override
    public List<RolesPageFlutter> getPagesByRole(int roleId) {
        return rolePageRepository.findByRoleId(roleId);
    }
}
