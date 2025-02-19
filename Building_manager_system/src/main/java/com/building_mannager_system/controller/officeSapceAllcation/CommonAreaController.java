package com.building_mannager_system.controller.officeSapceAllcation;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.CommonAreaDto;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.LocationDto;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.CommonArea;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.property_manager.Systems;
import com.building_mannager_system.service.officeAllcation.CommonAreaService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/common-areas")
public class CommonAreaController {

    private final CommonAreaService commonAreaService;

    public CommonAreaController(CommonAreaService commonAreaService) {
        this.commonAreaService = commonAreaService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách khu vực chung thành công")
    public ResponseEntity<ResultPaginationDTO> getAllCommonAreas(@Filter Specification<CommonArea> spec,
                                                                 Pageable pageable) {
        return ResponseEntity.ok(commonAreaService.getAllCommonAreas(spec, pageable));
    }

    /**
     * 📌 API: Tạo hoặc cập nhật `CommonArea`
     */
    @PostMapping
    @ApiMessage("Tạo khu vực chung thành công")
    public ResponseEntity<?> addOrUpdateCommonArea(@RequestBody CommonAreaDto commonAreaDTO) {
        try {
            CommonAreaDto savedArea = commonAreaService.createOrUpdateCommonArea(commonAreaDTO);
            return ResponseEntity.ok(savedArea);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo khu vực chung: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật vị trí thành công")
    public ResponseEntity<CommonAreaDto> updateCommonArea(@PathVariable(name = "id") int id,
                                                          @RequestBody CommonArea commonArea) {
        return ResponseEntity.ok(commonAreaService.updateCommonArea(id, commonArea));
    }

    /**
     * 📌 API: Lấy danh sách khu vực chung theo `LocationId`
     */
    @GetMapping("/list/{locationId}")
    public ResponseEntity<?> getCommonAreas(@PathVariable int locationId) {
        try {
            List<CommonArea> areas = commonAreaService.getCommonAreasByLocation(locationId);
            return ResponseEntity.ok(areas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy khu vực chung: " + e.getMessage());
        }
    }

    /**
     * 📌 API: Xóa `CommonArea`
     */
    @DeleteMapping("/{id}")
    @ApiMessage("Xóa khu vực chung thành công")
    public ResponseEntity<Void> deleteSystem(@PathVariable(name = "id") int id) {
        commonAreaService.deleteCommonArea(id);
        return ResponseEntity.ok(null);
    }
}
