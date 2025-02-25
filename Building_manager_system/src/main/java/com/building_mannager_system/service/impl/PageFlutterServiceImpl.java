package com.building_mannager_system.service.impl;

import com.building_mannager_system.entity.account.PageFlutter;
import com.building_mannager_system.repository.account.PageFlutterRepository;
import com.building_mannager_system.service.system_service.PageFlutterService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PageFlutterServiceImpl implements PageFlutterService {

    private PageFlutterRepository pageRepository;

    private PageFlutterServiceImpl(PageFlutterRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    @Override
    public List<PageFlutter> getAllPages() {
        return pageRepository.findAll();
    }

    @Override
    public List<PageFlutter> getPagesByRole(int roleId) {
        return pageRepository.findPageFlutterByRoleIdOrderByRoute(roleId);
    }

    @Override
    public PageFlutter createPage(PageFlutter page) {
        return pageRepository.save(page);
    }

    @Override
    public PageFlutter updatePage(int pageId, PageFlutter page) {
        PageFlutter existingPage = pageRepository.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page not found"));
        existingPage.setName(page.getName());
        existingPage.setRoute(page.getRoute());
        existingPage.setIcon(page.getIcon());
        existingPage.setStatus(page.isStatus());
        return pageRepository.save(existingPage);
    }

    @Override
    public void deletePage(int pageId) {
        pageRepository.deleteById(pageId);
    }
}
