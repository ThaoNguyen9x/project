package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.HandoverStatusDto;
import com.building_mannager_system.entity.customer_service.contact_manager.HandoverStatus;
import com.building_mannager_system.service.property_manager.HandoverStatusService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/handover-status")

public class HandoverStatusController {
    private final HandoverStatusService handoverStatusService;

    public HandoverStatusController(HandoverStatusService handoverStatusService) {
        this.handoverStatusService = handoverStatusService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách tình trạng bàn giao thành công")
    public ResponseEntity<ResultPaginationDTO> getAllHandoverStatus(@Filter Specification<HandoverStatus> spec,
                                                                    Pageable pageable) {
        return ResponseEntity.ok(handoverStatusService.getAllHandoverStatus(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo tình trạng bàn giao thành công")
    public ResponseEntity<HandoverStatusDto> createHandoverStatus(@ModelAttribute HandoverStatus handoverStatus,
                                                                  @RequestPart(value = "drawing", required = false) MultipartFile drawing) throws URISyntaxException, IOException {
        return new ResponseEntity<>(handoverStatusService.createHandoverStatus(drawing, handoverStatus), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy tình trạng bàn giao thành công")
    public ResponseEntity<HandoverStatusDto> getHandoverStatus(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(handoverStatusService.getHandoverStatus(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật tình trạng bàn giao thành công")
    public ResponseEntity<HandoverStatusDto> updateHandoverStatus(@PathVariable(name = "id") int id,
                                                                  @RequestPart(value = "drawing", required = false) MultipartFile drawing,
                                                                  @ModelAttribute HandoverStatus handoverStatus) throws URISyntaxException, IOException {
        return ResponseEntity.ok(handoverStatusService.updateHandoverStatus(id, drawing, handoverStatus));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa tình trạng bàn giao thành công")
    public ResponseEntity<Void> deleteHandoverStatus(@PathVariable(name = "id") int id) throws URISyntaxException {
        handoverStatusService.deleteHandoverStatus(id);
        return ResponseEntity.ok(null);
    }
}
