package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.ElectricityUsageDTO;
import com.building_mannager_system.entity.customer_service.system_manger.ElectricityUsage;
import com.building_mannager_system.service.system_service.ElectricityUsageService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/electricity-usages")
public class ElectricityUsageController {
    private final ElectricityUsageService electricityUsageService;

    public ElectricityUsageController(ElectricityUsageService electricityUsageService) {
        this.electricityUsageService = electricityUsageService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách mức tiêu thụ điện thành công")
    public ResponseEntity<ResultPaginationDTO> getAllElectricityUsages(@Filter Specification<ElectricityUsage> spec,
                                                             Pageable pageable) {
        return ResponseEntity.ok(electricityUsageService.getAllElectricityUsages(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo mức tiêu thụ điện thành công")
    public ResponseEntity<ElectricityUsageDTO> createElectricityUsage(@RequestPart(value = "image", required = false) MultipartFile image,
                                                                      @ModelAttribute ElectricityUsage electricityUsage) {
        return new ResponseEntity<>(electricityUsageService.createElectricityUsage(image, electricityUsage), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy mức tiêu thụ điện thành công")
    public ResponseEntity<ElectricityUsageDTO> getElectricityUsage(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(electricityUsageService.getElectricityUsage(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật mức tiêu thụ điện thành công")
    public ResponseEntity<ElectricityUsageDTO> updateElectricityUsage(@PathVariable(name = "id") int id,
                                                   @RequestPart(value = "image", required = false) MultipartFile image,
                                                   @ModelAttribute ElectricityUsage electricityUsage) throws URISyntaxException {
        return ResponseEntity.ok(electricityUsageService.updateElectricityUsage(id, image, electricityUsage));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa mức tiêu thụ điện thành công")
    public ResponseEntity<Void> deleteElectricityUsage(@PathVariable(name = "id") int id) throws URISyntaxException {
        electricityUsageService.deleteElectricityUsage(id);
        return ResponseEntity.ok(null);
    }
}
