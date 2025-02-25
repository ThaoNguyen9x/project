package com.building_mannager_system.service.system_service;

import com.building_mannager_system.entity.account.PageFlutter;

import java.util.List;

public interface PageFlutterService {
    List<PageFlutter> getAllPages();
    List<PageFlutter> getPagesByRole(int roleId);
    PageFlutter createPage(PageFlutter page);
    PageFlutter updatePage(int pageId, PageFlutter page);
    void deletePage(int pageId);
}
