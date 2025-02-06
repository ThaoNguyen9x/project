package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.ElectricityRateDto;
import com.building_mannager_system.entity.customer_service.system_manger.ElectricityRate;
import com.building_mannager_system.service.system_service.ElectricityRateService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/electricity-rates")
public class ElectricityRateController {
    private final ElectricityRateService electricityRateService;

    public ElectricityRateController(ElectricityRateService electricityRateService) {
        this.electricityRateService = electricityRateService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách giá điện thành công")
    public ResponseEntity<ResultPaginationDTO> getAllElectricityRates(@Filter Specification<ElectricityRate> spec,
                                                                 Pageable pageable) {
        return ResponseEntity.ok(electricityRateService.getAllElectricityRates(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo giá điện thành công")
    public ResponseEntity<ElectricityRateDto> createElectricityRate(@RequestBody ElectricityRate electricityRate) {
        return new ResponseEntity<>(electricityRateService.createElectricityRate(electricityRate), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy giá điện thành công")
    public ResponseEntity<ElectricityRateDto> getElectricityRate(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(electricityRateService.getElectricityRate(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật giá điện thành công")
    public ResponseEntity<ElectricityRateDto> updateElectricityRate(@PathVariable(name = "id") int id,
                                                          @RequestBody ElectricityRate electricityRate) {
        return ResponseEntity.ok(electricityRateService.updateElectricityRate(id, electricityRate));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa giá điện thành công")
    public ResponseEntity<Void> deleteElectricityRate(@PathVariable(name = "id") int id) {
        electricityRateService.deleteElectricityRate(id);
        return ResponseEntity.ok(null);
    }
}
