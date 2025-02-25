package com.building_mannager_system.controller.account;

import com.building_mannager_system.entity.account.PageFlutter;
import com.building_mannager_system.service.system_service.PageFlutterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
public class PageController {

    private final PageFlutterService pageFlutterService;

    public PageController(PageFlutterService pageFlutterService) {
        this.pageFlutterService = pageFlutterService;
    }

    @GetMapping
    public ResponseEntity<List<PageFlutter>> getAllPages() {
        List<PageFlutter> pages = pageFlutterService.getAllPages();
        return ResponseEntity.ok(pages);
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<PageFlutter>> getPagesByRole(@PathVariable int roleId) {
        List<PageFlutter> pages = pageFlutterService.getPagesByRole(roleId);
        return ResponseEntity.ok(pages);
    }

    @PostMapping
    public ResponseEntity<PageFlutter> createPage(@RequestBody PageFlutter page) {
        PageFlutter createdPage = pageFlutterService.createPage(page);
        return ResponseEntity.ok(createdPage);
    }

    @PutMapping("/{pageId}")
    public ResponseEntity<PageFlutter> updatePage(@PathVariable int pageId, @RequestBody PageFlutter page) {
        PageFlutter updatedPage = pageFlutterService.updatePage(pageId, page);
        return ResponseEntity.ok(updatedPage);
    }

    @DeleteMapping("/{pageId}")
    public ResponseEntity<Void> deletePage(@PathVariable int pageId) {
        pageFlutterService.deletePage(pageId);
        return ResponseEntity.noContent().build();
    }
}
