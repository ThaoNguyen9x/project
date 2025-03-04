package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultDto;
import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultFlutterDto;
import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckDto;
import com.building_mannager_system.dto.responseDto.ApiResponce;
import com.building_mannager_system.service.property_manager.ItemCheckResultService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/item_check_result")
public class ItemCheckResultController {
    private final ItemCheckResultService itemCheckResultService;

    public ItemCheckResultController(ItemCheckResultService itemCheckResultService) {
        this.itemCheckResultService = itemCheckResultService;
    }

    // **1. Lấy danh sách kết quả kiểm tra theo ItemCheckId**
    @GetMapping("/item-check/{itemCheckId}")
    public ResponseEntity<Page<CheckResultFlutterDto>> getResultsByCheckItemId(
            @PathVariable("itemCheckId") Long checkItemId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "2") int size) {

        Page<CheckResultFlutterDto> checkResults = itemCheckResultService.getResultsByCheckItemIdPaged(checkItemId, page, size);
        return ResponseEntity.ok(checkResults);
    }

    // **2. Thêm mới một kết quả kiểm tra**
    @PostMapping
    public ResponseEntity<ApiResponce<CheckResultFlutterDto>> createResult(@RequestBody CheckResultFlutterDto resultDto) {
        CheckResultFlutterDto createdResult = itemCheckResultService.createResult(resultDto);
        ApiResponce<CheckResultFlutterDto> response = new ApiResponce<>(201, createdResult, "Result created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CheckResultFlutterDto> getItemCheck(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(itemCheckResultService.getResultById(id));
    }

    @GetMapping("/web/{id}")
    public ResponseEntity<CheckResultDto> getItemCheckByID(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(itemCheckResultService.getResult(id));
    }

    // **4. Cập nhật một kết quả kiểm tra**
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponce<CheckResultFlutterDto>> updateResult(
            @PathVariable Long id,
            @RequestBody CheckResultFlutterDto updatedResultDto) {
        CheckResultFlutterDto updatedResult = itemCheckResultService.updateResult(id, updatedResultDto);
        ApiResponce<CheckResultFlutterDto> response = new ApiResponce<>(200, updatedResult, "Result updated successfully");
        return ResponseEntity.ok(response);
    }

    // **5. Xóa một kết quả kiểm tra**
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponce<Void>> deleteResult(@PathVariable Long id) {
        itemCheckResultService.deleteResult(id);
        ApiResponce<Void> response = new ApiResponce<>(200, null, "Result deleted successfully");
        return ResponseEntity.ok(response);
    }
}