package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.MeterDto;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.building_mannager_system.service.system_service.MeterService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meters")
public class MeterController {

    private final MeterService meterService;

    public MeterController(MeterService meterService) {
        this.meterService = meterService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách đồng hồ đo thành công")
    public ResponseEntity<ResultPaginationDTO> getAllMeters(@Filter Specification<Meter> spec,
                                                                   Pageable pageable) {
        return ResponseEntity.ok(meterService.getAllMeters(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo đồng hồ đo thành công")
    public ResponseEntity<MeterDto> createMeter(@RequestBody Meter meter) {
        return new ResponseEntity<>(meterService.createMeter(meter), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy đồng hồ đo thành công")
    public ResponseEntity<MeterDto> getMeter(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(meterService.getMeter(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật đồng hồ đo thành công")
    public ResponseEntity<MeterDto> updateMeter(@PathVariable(name = "id") int id,
                                                              @RequestBody Meter meter) {
        return ResponseEntity.ok(meterService.updateMeter(id, meter));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa đồng hồ đo thành công")
    public ResponseEntity<Void> deleteMeter(@PathVariable(name = "id") int id) {
        meterService.deleteMeter(id);
        return ResponseEntity.ok(null);
    }
}
