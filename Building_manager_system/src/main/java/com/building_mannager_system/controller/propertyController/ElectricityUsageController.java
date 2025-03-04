package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.ElectricUsageRequestDto;
import com.building_mannager_system.dto.requestDto.propertyDto.ElectricityUsageDTO;
import com.building_mannager_system.entity.customer_service.system_manger.ElectricityUsage;
import com.building_mannager_system.service.system_service.ElectricityUsageService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/electricity-usages")
public class ElectricityUsageController {
    private final ElectricityUsageService electricityUsageService;
    private final ModelMapper modelMapper;

    public ElectricityUsageController(ElectricityUsageService electricityUsageService, ModelMapper modelMapper) {
        this.electricityUsageService = electricityUsageService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách mức tiêu thụ điện thành công")
    public ResponseEntity<ResultPaginationDTO> getAllElectricityUsages(@Filter Specification<ElectricityUsage> spec,
                                                             Pageable pageable) {
        return ResponseEntity.ok(electricityUsageService.getAllElectricityUsages(spec, pageable));
    }

    @PostMapping("/create")
    @ApiMessage("Tạo mức tiêu thụ điện thành công")
    public ResponseEntity<ElectricityUsageDTO> createElectricityUsage(@RequestPart(value = "image", required = false) MultipartFile image,
                                                                      @ModelAttribute ElectricityUsage electricityUsage) {
        return new ResponseEntity<>(electricityUsageService.createElectricityUsageW(image, electricityUsage), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy mức tiêu thụ điện thành công")
    public ResponseEntity<ElectricityUsageDTO> getElectricityUsage(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(electricityUsageService.getElectricityUsage(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật mức tiêu thụ điện thành công")
    public ResponseEntity<ElectricityUsageDTO> updateElectricityUsage(@PathVariable(name = "id") int id,
                                                   @RequestPart(value = "image", required = false) MultipartFile image,
                                                   @ModelAttribute ElectricityUsage electricityUsage) throws URISyntaxException {
        return ResponseEntity.ok(electricityUsageService.updateElectricityUsage(id, image, electricityUsage));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa mức tiêu thụ điện thành công")
    public ResponseEntity<Void> deleteElectricityUsage(@PathVariable(name = "id") int id) throws URISyntaxException {
        electricityUsageService.deleteElectricityUsage(id);
        return ResponseEntity.ok(null);
    }

    @PutMapping("/change/{id}")
    @ApiMessage("Cập nhật trạng thái thành công")
    public ResponseEntity<ElectricityUsageDTO> updateStatus(@PathVariable(name = "id") int id,
                                                                      @RequestBody ElectricityUsage electricityUsage) {
        return ResponseEntity.ok(electricityUsageService.updateStatus(id, electricityUsage));
    }

    @PostMapping
    @ApiMessage("Tạo mức tiêu thụ điện thành công")
    public ResponseEntity<ElectricUsageRequestDto> createElectricityUsage(@RequestPart(value = "image", required = false) MultipartFile image,
                                                                          @ModelAttribute ElectricUsageRequestDto electricUsageRequestDto) {
        return new ResponseEntity<>(electricityUsageService.createElectricityUsage(image, electricUsageRequestDto), HttpStatus.CREATED);
    }

    //luongth
    @GetMapping("/meter/{meterId}")
    public ResponseEntity<ResultPaginationDTO> getHistoryElectricityUsagesByMeterId(
            @PathVariable int meterId,
            @RequestParam(required = false) Specification<ElectricityUsage> spec,
            Pageable pageable) {

        ResultPaginationDTO result = electricityUsageService.getHistoryElectricityUsagesByMeterId(spec, pageable, meterId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/usage-history")
    public ResponseEntity<List<ElectricityUsageDTO>> getElectricityUsageHistory(@RequestParam("meterId") int meterId) {
        try {
            // Lấy danh sách lịch sử sử dụng điện dựa trên meterId
            List<ElectricityUsage> usageHistory = electricityUsageService.getElectricityUsageByMeterAndDate(meterId);

            // Chuyển đổi danh sách thực thể sang danh sách DTO
            List<ElectricityUsageDTO> usageHistoryDTO = usageHistory.stream()
                    .map(usage -> modelMapper.map(usage, ElectricityUsageDTO.class))
                    .collect(Collectors.toList());

            // Trả về danh sách DTO với mã trạng thái 200 OK
            return ResponseEntity.ok(usageHistoryDTO);
        } catch (Exception e) {
            // Log lỗi để dễ dàng theo dõi
            e.printStackTrace();

            // Trả về lỗi với mã trạng thái 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList()); // Trả về danh sách rỗng trong trường hợp lỗi
        }
    }
}
