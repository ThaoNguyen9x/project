package com.building_mannager_system.service.officeAllcation;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.CommonAreaDto;
import com.building_mannager_system.dto.requestDto.systemDto.SystemDto;
import com.building_mannager_system.entity.Role;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.CommonArea;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.property_manager.Systems;
import com.building_mannager_system.repository.office.CommonAreaRepository;
import com.building_mannager_system.repository.office.LocationRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommonAreaService {

    private final CommonAreaRepository commonAreaRepository;
    private final LocationRepository locationRepository;
    private  final ModelMapper modelMapper;

    public CommonAreaService(CommonAreaRepository commonAreaRepository, LocationRepository locationRepository) {
        this.commonAreaRepository = commonAreaRepository;
        this.locationRepository = locationRepository;
        this.modelMapper = new ModelMapper();
    }

    /**
     * 📌 Tạo hoặc cập nhật `CommonArea`
     */
    public CommonAreaDto createOrUpdateCommonArea(CommonAreaDto commonAreaDTO) {
        Location location = locationRepository.findById(commonAreaDTO.getLocation().getId())
                .orElseThrow(() -> new RuntimeException("Location không tồn tại"));

        // 📌 Sử dụng ModelMapper để chuyển DTO -> Entity
        CommonArea commonArea = modelMapper.map(commonAreaDTO, CommonArea.class);
        commonArea.setLocation(location);
        commonArea.calculateArea();

        // 📌 Cập nhật diện tích chung trong `Location`
        location.setCommonArea(location.getCommonArea() + commonArea.getArea());

        locationRepository.save(location);

        // 📌 Lưu khu vực chung
        commonArea = commonAreaRepository.save(commonArea);

        // 📌 Trả về kết quả dạng DTO
        return modelMapper.map(commonArea, CommonAreaDto.class);
    }

    /**
     * 📌 Lấy danh sách `CommonArea` theo `Location`
     */
    public List<CommonArea> getCommonAreasByLocation(int locationId) {
        return commonAreaRepository.findByLocation_Id(locationId);
    }

    public ResultPaginationDTO getAllCommonAreas(Specification<CommonArea> spec,
                                             Pageable pageable) {

        Page<CommonArea> page = commonAreaRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<CommonAreaDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, CommonAreaDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public CommonAreaDto updateCommonArea(int id, CommonArea commonArea) {
        CommonArea ex = commonAreaRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Common area not found with ID: " + id));

        double oldArea = ex.getArea();

        ex.setName(commonArea.getName());
        ex.setColor(commonArea.getColor());
        ex.setStartX(commonArea.getStartX());
        ex.setStartY(commonArea.getStartY());
        ex.setEndX(commonArea.getEndX());
        ex.setEndY(commonArea.getEndY());

        ex.calculateArea();
        double newArea = ex.getArea();

        commonAreaRepository.save(ex);

        if (commonArea.getLocation() != null) {
            Location location = locationRepository.findById(commonArea.getLocation().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + commonArea.getLocation().getId()));

            location.setCommonArea(location.getCommonArea() - oldArea + newArea);
            locationRepository.save(location);
        }

        return modelMapper.map(ex, CommonAreaDto.class);
    }

    /**
     * 📌 Xóa `CommonArea` và cập nhật lại `netArea` của `Location`
     */
    public void deleteCommonArea(int id) {
        CommonArea commonArea = commonAreaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khu vực chung với ID: " + id));

        Location location = commonArea.getLocation();

        // 📌 Trừ diện tích chung khỏi `Location`
        location.setCommonArea(location.getCommonArea() - commonArea.getArea());
        locationRepository.save(location);

        commonAreaRepository.delete(commonArea);
    }
}
