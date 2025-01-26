package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.DeviceTypeDto;
import com.building_mannager_system.entity.property_manager.DeviceType;
import com.building_mannager_system.repository.system_manager.DeviceTypeRepository;
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
public class DeviceTypeService {
    private final DeviceTypeRepository deviceTypeRepository;
    private final ModelMapper modelMapper;

    public DeviceTypeService(DeviceTypeRepository deviceTypeRepository,
                             ModelMapper modelMapper) {
        this.deviceTypeRepository = deviceTypeRepository;
        this.modelMapper = modelMapper;
    }

    public ResultPaginationDTO getAllDeviceTypes(Specification<DeviceType> spec,
                                                   Pageable pageable) {

        Page<DeviceType> page = deviceTypeRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<DeviceTypeDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, DeviceTypeDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public DeviceTypeDto createDeviceType(DeviceType deviceType) {
        if (deviceTypeRepository.existsByTypeName(deviceType.getTypeName()))
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên loại thiết bị này đã được sử dụng");

        return modelMapper.map(deviceTypeRepository.save(deviceType), DeviceTypeDto.class);
    }

    public DeviceTypeDto getDeviceType(Long id) {
        DeviceType deviceType = deviceTypeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device type not found with ID: " + id));

        return modelMapper.map(deviceType, DeviceTypeDto.class);
    }

    public DeviceTypeDto updateDeviceType(Long id, DeviceType deviceType) {
        DeviceType ex = deviceTypeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device type not found with ID: " + id));

        if (deviceTypeRepository.existsByTypeNameAndIdNot(deviceType.getTypeName(), id))
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên loại thiết bị này đã được sử dụng");

        ex.setTypeName(deviceType.getTypeName());
        ex.setDescription(deviceType.getDescription());

        return modelMapper.map(deviceTypeRepository.save(ex), DeviceTypeDto.class);
    }

    public void deleteDeviceType(Long id) {
        DeviceType deviceType = deviceTypeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device type not found with ID: " + id));

        deviceTypeRepository.delete(deviceType);
    }
}
