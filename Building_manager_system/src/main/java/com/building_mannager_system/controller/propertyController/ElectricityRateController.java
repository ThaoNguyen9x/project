package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.DeviceTypeDto;
import com.building_mannager_system.dto.responseDto.ApiResponce;
import com.building_mannager_system.entity.property_manager.DeviceType;
import com.building_mannager_system.service.property_manager.DeviceTypeService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/device-types")
public class DeviceTypeController {
    private final DeviceTypeService deviceTypeService;

    public DeviceTypeController(DeviceTypeService deviceTypeService) {
        this.deviceTypeService = deviceTypeService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách loại thiết bị thành công")
    public ResponseEntity<ResultPaginationDTO> getAllDeviceTypes(@Filter Specification<DeviceType> spec,
                                                                 Pageable pageable) {
        return ResponseEntity.ok(deviceTypeService.getAllDeviceTypes(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo loại thiết bị thành công")
    public ResponseEntity<DeviceTypeDto> createDeviceType(@RequestBody DeviceType deviceType) {
        return new ResponseEntity<>(deviceTypeService.createDeviceType(deviceType), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy loại thiết bị thành công")
    public ResponseEntity<DeviceTypeDto> getDeviceType(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(deviceTypeService.getDeviceType(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật loại thiết bị thành công")
    public ResponseEntity<DeviceTypeDto> updateDeviceType(@PathVariable(name = "id") Long id,
                                                          @RequestBody DeviceType deviceType) {
        return ResponseEntity.ok(deviceTypeService.updateDeviceType(id, deviceType));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa loại thiết bị thành công")
    public ResponseEntity<Void> deleteDeviceType(@PathVariable(name = "id") Long id) {
        deviceTypeService.deleteDeviceType(id);
        return ResponseEntity.ok(null);
    }
}
