package com.building_mannager_system.controller.officeSapceAllcation;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.LocationDto;
import com.building_mannager_system.dto.responseDto.LocationResponseDto;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.service.officeAllcation.LocationService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/locations")
public class LocationController {
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách vị trí thành công")
    public ResponseEntity<ResultPaginationDTO> getAllOffices(@Filter Specification<Location> spec,
                                                             Pageable pageable) {
        return ResponseEntity.ok(locationService.getAllLocations(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo vị trí thành công")
    public ResponseEntity<LocationDto> createLocation(@RequestBody Location location) {
        return new ResponseEntity<>(locationService.createLocation(location), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật vị trí thành công")
    public ResponseEntity<LocationDto> updateLocation(@PathVariable(name = "id") int id,
                                                      @RequestBody Location location) {
        return ResponseEntity.ok(locationService.updateLocation(id, location));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa vị trí thành công")
    public ResponseEntity<Void> deleteSystem(@PathVariable(name = "id") int id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationDto> getLocationById(
            @PathVariable int id,
            @RequestParam(required = false) String deviceType) {

        // Chuyển `deviceType` thành `Optional<String>`
        Optional<String> optionalDeviceType = Optional.ofNullable(deviceType);

        // Gọi service và trả về dữ liệu
        LocationDto locationDto = locationService.getLocationById(id, optionalDeviceType);

        return ResponseEntity.ok(locationDto);
    }
}
