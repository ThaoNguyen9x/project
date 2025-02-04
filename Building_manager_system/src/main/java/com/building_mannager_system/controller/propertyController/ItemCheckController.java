package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckDto;
import com.building_mannager_system.entity.property_manager.ItemCheck;
import com.building_mannager_system.service.property_manager.ItemCheckService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/item-checks")
public class ItemCheckController {
    private final ItemCheckService itemCheckService;

    public ItemCheckController(ItemCheckService itemCheckService) {
        this.itemCheckService = itemCheckService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách kiểm tra mục thành công")
    public ResponseEntity<ResultPaginationDTO> getAllItemChecks(@Filter Specification<ItemCheck> spec,
                                                                          Pageable pageable) {
        return ResponseEntity.ok(itemCheckService.getAllItemChecks(spec, pageable));
    }

    @GetMapping("/device/{deviceId}")
    @ApiMessage("Lấy danh sách kiểm tra mục theo thiết bị thành công")
    public ResponseEntity<ResultPaginationDTO> getAllItemChecksByDeviceId(@PathVariable(name = "deviceId") Long deviceId,
                                                                          @Filter Specification<ItemCheck> spec,
                                                                          Pageable pageable) {
        return ResponseEntity.ok(itemCheckService.getAllItemChecksByDeviceId(deviceId, spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo kiểm tra mục thành công")
    public ResponseEntity<ItemCheckDto> createMeter(@RequestBody ItemCheck itemCheck) {
        return new ResponseEntity<>(itemCheckService.createItemCheck(itemCheck), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy kiểm tra mục thành công")
    public ResponseEntity<ItemCheckDto> getItemCheck(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(itemCheckService.getItemCheck(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật kiểm tra mục thành công")
    public ResponseEntity<ItemCheckDto> updateItemCheck(@PathVariable(name = "id") Long id,
                                                        @RequestBody ItemCheck itemCheck) {
        return ResponseEntity.ok(itemCheckService.updateItemCheck(id, itemCheck));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa kiểm tra mục thành công")
    public ResponseEntity<Void> deleteItemCheck(@PathVariable(name = "id") Long id) {
        itemCheckService.deleteItemCheck(id);
        return ResponseEntity.ok(null);
    }
}
