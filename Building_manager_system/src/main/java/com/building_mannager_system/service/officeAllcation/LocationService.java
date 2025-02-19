package com.building_mannager_system.service.officeAllcation;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.CommonAreaDto;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.LocationDto;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficeRequestDto;
import com.building_mannager_system.dto.requestDto.systemDto.SystemDto;
import com.building_mannager_system.dto.responseDto.DeviceResponceDto;
import com.building_mannager_system.dto.responseDto.LocationResponseDto;
import com.building_mannager_system.dto.responseDto.ResUserDTO;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.CommonAreaTemplate;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.property_manager.Systems;
import com.building_mannager_system.repository.office.CommonAreaRepository;
import com.building_mannager_system.repository.office.CommonAreaTemplateRepository;
import com.building_mannager_system.repository.office.LocationRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final ModelMapper modelMapper;
    private final CommonAreaTemplateRepository commonAreaTemplateRepository;
    private final CommonAreaRepository commonAreaRepository;

    public LocationService(LocationRepository locationRepository,
                           ModelMapper modelMapper,
                           CommonAreaTemplateRepository commonAreaTemplateRepository,
                           CommonAreaRepository commonAreaRepository) {
        this.commonAreaRepository = commonAreaRepository;
        this.commonAreaTemplateRepository = commonAreaTemplateRepository;
        this.locationRepository = locationRepository;
        this.modelMapper = modelMapper;
    }

    public ResultPaginationDTO getAllLocations(Specification<Location> spec,
                                               Pageable pageable) {

        Page<Location> page = locationRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<LocationDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, LocationDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public LocationDto createLocation(Location location) {
        if (locationRepository.existsByFloor(location.getFloor()))
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên tầng này đã được sử dụng");

        // Nếu tầng sử dụng CommonAreaTemplate, áp dụng danh sách phù hợp
        List<CommonAreaTemplate> templates = commonAreaTemplateRepository.findAll();
        location.applyCommonAreas(templates); // Gán CommonArea từ template

        // Tính toán diện tích location
        location.calculateArea();

        return modelMapper.map(locationRepository.save(location), LocationDto.class);
    }

    public LocationDto updateLocation(int id, Location location) {
        Location ex = locationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + id));

        if (locationRepository.existsByFloorAndIdNot(location.getFloor(), id))
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên tầng này đã được sử dụng");

        // Nếu tầng sử dụng CommonAreaTemplate, áp dụng danh sách phù hợp
        List<CommonAreaTemplate> templates = commonAreaTemplateRepository.findAll();
        location.applyCommonAreas(templates); // Gán CommonArea từ template
        location.calculateArea();

        ex.setFloor(location.getFloor());
        ex.setNumberFloor(location.getNumberFloor());
        ex.setCommonArea(location.getCommonArea());
        ex.setNetArea(location.getNetArea());
        ex.setStartX(location.getStartX());
        ex.setStartY(location.getStartY());
        ex.setEndX(location.getEndX());
        ex.setEndY(location.getEndY());
        ex.setTotalArea(location.getTotalArea());

        return modelMapper.map(locationRepository.save(ex), LocationDto.class);
    }

    public void deleteLocation(int id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + id));

        locationRepository.delete(location);
    }

    public LocationDto getLocationById(int id, Optional<String> deviceType) {
        // Lấy Location theo ID
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        // Mapping Location sang LocationDto
        LocationDto locationDTO = modelMapper.map(location, LocationDto.class);

        // Lọc danh sách thiết bị theo deviceType nếu có
        List<LocationDto.DeviceDto> devices = location.getDevices().stream()
                .filter(device ->
                        deviceType.isEmpty() ||
                                device.getDeviceType().getTypeName().toLowerCase().contains(deviceType.get().toLowerCase())
                ) // Lọc thiết bị theo deviceType, chấp nhận tìm kiếm theo chuỗi con
                .map(device -> modelMapper.map(device, LocationDto.DeviceDto.class))
                .collect(Collectors.toList());

        locationDTO.setDevices(devices);

        // Chuyển đổi danh sách CommonArea sang CommonAreaDto
        List<LocationDto.CommonAreaDto> commonAreaDTOs = location.getCommonAreas().stream()
                .map(area -> modelMapper.map(area, LocationDto.CommonAreaDto.class))
                .collect(Collectors.toList());

        locationDTO.setCommonAreas(commonAreaDTOs);

        // Chuyển đổi danh sách Offices sang OfficesDto
        List<LocationDto.OfficesDto> officesDTOs = location.getOffices().stream()
                .map(office -> modelMapper.map(office, LocationDto.OfficesDto.class))
                .collect(Collectors.toList());

        locationDTO.setOffices(officesDTOs);

        return locationDTO;
    }
}
