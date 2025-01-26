package com.building_mannager_system.controller.officeSapceAllcation;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.service.officeAllcation.LocationService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
