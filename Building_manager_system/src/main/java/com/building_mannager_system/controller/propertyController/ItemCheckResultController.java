package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultDto;
import com.building_mannager_system.entity.property_manager.ItemCheckResult;
import com.building_mannager_system.service.property_manager.ItemCheckResultService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/result-checks")
public class ItemCheckResultController {
    private final ItemCheckResultService itemCheckResultService;

    public ItemCheckResultController(ItemCheckResultService itemCheckResultService) {
        this.itemCheckResultService = itemCheckResultService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách kết quả kiểm tra mục thành công")
    public ResponseEntity<ResultPaginationDTO> getAllResults(@Filter Specification<ItemCheckResult> spec,
                                                                       Pageable pageable) {
        return ResponseEntity.ok(itemCheckResultService.getAllResults(spec, pageable));
    }

    @GetMapping("/item-check/{itemCheckId}")
    @ApiMessage("Lấy danh sách kết quả kiểm tra mục theo kiểm tra mục thành công")
    public ResponseEntity<ResultPaginationDTO> getResultsByCheckItemId(@PathVariable(name = "itemCheckId") Long itemCheckId,
                                                                          @Filter Specification<ItemCheckResult> spec,
                                                                          Pageable pageable) {
        return ResponseEntity.ok(itemCheckResultService.getResultsByCheckItemId(itemCheckId, spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo kết quả kiểm tra mục thành công")
    public ResponseEntity<CheckResultDto> createResult(@RequestBody ItemCheckResult itemCheckResult) {
        return new ResponseEntity<>(itemCheckResultService.createResult(itemCheckResult), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy kết quả kiểm tra mục thành công")
    public ResponseEntity<CheckResultDto> getResult(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(itemCheckResultService.getResult(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật kết quả kiểm tra mục thành công")
    public ResponseEntity<CheckResultDto> updateResult(@PathVariable(name = "id") Long id,
                                                        @RequestBody ItemCheckResult itemCheckResult) {
        return ResponseEntity.ok(itemCheckResultService.updateResult(id, itemCheckResult));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa kết quả kiểm tra mục thành công")
    public ResponseEntity<Void> deleteResults(@PathVariable(name = "id") Long id) {
        itemCheckResultService.deleteResults(id);
        return ResponseEntity.ok(null);
    }
}
