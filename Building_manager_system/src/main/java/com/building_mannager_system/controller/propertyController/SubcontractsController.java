package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.systemDto.SubcontractorDto;
import com.building_mannager_system.entity.property_manager.Subcontractor;
import com.building_mannager_system.service.property_manager.SubcontractorService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subcontractors")
public class SubcontractsController {
    private final SubcontractorService subcontractorService;

    public SubcontractsController(SubcontractorService subcontractorService) {
        this.subcontractorService = subcontractorService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách hợp đồng nhà thầu phụ thành công")
    public ResponseEntity<ResultPaginationDTO> getAllSubcontractors(@Filter Specification<Subcontractor> spec,
                                                             Pageable pageable) {
        return ResponseEntity.ok(subcontractorService.getAllSubcontractors(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo hợp đồng nhà thầu phụ thành công")
    public ResponseEntity<SubcontractorDto> createSubcontractor(@RequestBody Subcontractor subContractor) {
        return new ResponseEntity<>(subcontractorService.createSubcontractor(subContractor), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy hợp đồng nhà thầu phụ thành công")
    public ResponseEntity<SubcontractorDto> getSubcontractor(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(subcontractorService.getSubcontractor(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật hợp đồng nhà thầu phụ thành công")
    public ResponseEntity<SubcontractorDto> updateSubcontractor(@PathVariable(name = "id") int id,
                                                   @RequestBody Subcontractor subContractor) {
        return ResponseEntity.ok(subcontractorService.updateSubcontractor(id, subContractor));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa hợp đồng nhà thầu phụ thành công")
    public ResponseEntity<Void> deleteSubcontractor(@PathVariable(name = "id") int id) {
        subcontractorService.deleteSubcontractor(id);
        return ResponseEntity.ok(null);
    }
}
