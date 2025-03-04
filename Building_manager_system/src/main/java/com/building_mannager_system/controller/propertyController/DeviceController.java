package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.AddRiskAssessmentAndMaintenanceHistoryRequestDto;
import com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto;
import com.building_mannager_system.dto.responseDto.DeviceResponceDto;
import com.building_mannager_system.entity.property_manager.Device;
import com.building_mannager_system.service.property_manager.DeviceService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách thiết bị thành công")
    public ResponseEntity<ResultPaginationDTO> getAllDevices(@Filter Specification<Device> spec,
                                                               Pageable pageable) {
        return ResponseEntity.ok(deviceService.getAllDevices(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo thiết bị thành công")
    public ResponseEntity<DeviceDto> createDevice(@RequestBody Device device) {
        return new ResponseEntity<>(deviceService.createDevice(device), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy thiết bị thành công")
    public ResponseEntity<DeviceDto> getDevice(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(deviceService.getDevice(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật thiết bị thành công")
    public ResponseEntity<DeviceDto> updateDevice(@PathVariable(name = "id") Long id,
                                                      @RequestBody Device device) {
        return ResponseEntity.ok(deviceService.updateDevice(id, device));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa thiết bị thành công")
    public ResponseEntity<Void> deleteDevice(@PathVariable(name = "id") Long id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.ok(null);
    }

    //luongth
    @PostMapping("/{deviceId}/risk-assessment-maintenance")
    public ResponseEntity<?> addRiskAssessmentAndMaintenanceHistory(
            @PathVariable Long deviceId,
            @Valid @RequestBody AddRiskAssessmentAndMaintenanceHistoryRequestDto requestDto) { // ✅ Use @Valid

        try {
            DeviceDto deviceDto = deviceService.addRiskAssessmentAndMaintenanceHistoryToDevice(
                    deviceId, requestDto.getRissAssessmentRequesFlutterDto(), requestDto.getMaintenanceRepuestFlutterDto());
            return ResponseEntity.ok(deviceDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 BAD REQUEST if input is invalid
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage()); // 500 INTERNAL SERVER ERROR
        }
    }

    @GetMapping("/response/{deviceId}")
    @ApiMessage("Lấy thiết bị  thành công")
    public ResponseEntity<DeviceResponceDto> getDeviceResponce(@PathVariable Long deviceId) {

        return  ResponseEntity.ok(deviceService.getDeviceResponce(deviceId));
    }
}
