package com.building_mannager_system.controller.work_registration;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.entity.work_registration.RepairRequest;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.service.work_registration.RepairRequestService;
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
@RequestMapping("/api/repair-requests")
public class RepairRequestController {
    private final RepairRequestService repairRequestService;

    public RepairRequestController(RepairRequestService repairRequestService) {
        this.repairRequestService = repairRequestService;
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật yêu cầu sửa chữa thành công")
    public ResponseEntity<RepairRequestDto> updateRepairRequest(@PathVariable(name = "id") int id,
                                                                @RequestPart(value = "image", required = false) MultipartFile image,
                                                                @ModelAttribute RepairRequest repairRequest) throws URISyntaxException {
        return ResponseEntity.ok(repairRequestService.updateRepairRequest(id, image, repairRequest));
    }

    @PostMapping
    @ApiMessage("Tạo yêu cầu sửa chữa thành công")
    public ResponseEntity<RepairRequestDto> createRepairRequest(@RequestPart(value = "image", required = false) MultipartFile image,
                                                                @ModelAttribute RepairRequest repairRequest) {
        return new ResponseEntity<>(repairRequestService.createRepairRequest(image, repairRequest), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy yêu cầu sửa chữa thành công")
    public ResponseEntity<RepairRequestDto> getRepairRequest(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(repairRequestService.getRepairRequest(id));
    }

    // ✅ Lấy tất cả yêu cầu cho Admin
    @GetMapping
    @ApiMessage("Lấy danh sách yêu cầu sửa chữa thành công")
    public ResponseEntity<ResultPaginationDTO> getAllRepairRequests(@Filter Specification<RepairRequest> spec,
                                                                    Pageable pageable) {
        return ResponseEntity.ok(repairRequestService.getAllRepairRequests(spec, pageable));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa yêu cầu sửa chữa thành công")
    public ResponseEntity<Void> deleteRepairRequest(@PathVariable(name = "id") int id) throws URISyntaxException {
        repairRequestService.deleteRepairRequest(id);
        return ResponseEntity.ok(null);
    }
}
