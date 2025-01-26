package com.building_mannager_system.controller.officeSapceAllcation;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.service.officeAllcation.OfficeService;
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
@RequestMapping("/api/offices")
public class OfficeController {
    private final OfficeService officeService;

    public OfficeController(OfficeService officeService) {
        this.officeService = officeService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách văn phòng thành công")
    public ResponseEntity<ResultPaginationDTO> getAllOffices(@Filter Specification<Office> spec,
                                                             Pageable pageable) {
        return ResponseEntity.ok(officeService.getAllOffices(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo văn phòng thành công")
    public ResponseEntity<OfficesDto> createOffice(@RequestPart(value = "drawing", required = false) MultipartFile drawing,
                                                   @ModelAttribute Office office) {
        return new ResponseEntity<>(officeService.createOffice(drawing, office), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy văn phòng thành công")
    public ResponseEntity<OfficesDto> getOffice(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(officeService.getOffice(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật văn phòng thành công")
    public ResponseEntity<OfficesDto> updateOffice(@PathVariable(name = "id") int id,
                                                   @RequestPart(value = "drawing", required = false) MultipartFile drawing,
                                                   @ModelAttribute Office office) throws URISyntaxException {
        return ResponseEntity.ok(officeService.updateOffice(id, drawing, office));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa văn phòng thành công")
    public ResponseEntity<Void> deleteOffice(@PathVariable(name = "id") int id) throws URISyntaxException {
        officeService.deleteOffice(id);
        return ResponseEntity.ok(null);
    }
}
