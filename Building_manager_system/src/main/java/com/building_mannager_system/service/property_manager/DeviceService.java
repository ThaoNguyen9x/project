package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.property_manager.Device;
import com.building_mannager_system.entity.property_manager.DeviceType;
import com.building_mannager_system.entity.property_manager.SystemMaintenanceService;
import com.building_mannager_system.entity.property_manager.Systems;
import com.building_mannager_system.repository.office.LocationRepository;
import com.building_mannager_system.repository.system_manager.DeviceRepository;
import com.building_mannager_system.repository.system_manager.DeviceTypeRepository;
import com.building_mannager_system.repository.system_manager.SystemMaintenanceServiceRepository;
import com.building_mannager_system.repository.system_manager.SystemsRepository;
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
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final ModelMapper modelMapper;
    private final SystemsRepository systemsRepository;
    private final LocationRepository locationRepository;
    private final DeviceTypeRepository deviceTypeRepository;
    private final SystemMaintenanceServiceRepository systemMaintenanceServiceRepository;

    public DeviceService(DeviceRepository deviceRepository,
                         ModelMapper modelMapper,
                         SystemsRepository systemsRepository,
                         LocationRepository locationRepository,
                         DeviceTypeRepository deviceTypeRepository,
                         SystemMaintenanceServiceRepository systemMaintenanceServiceRepository) {
        this.deviceRepository = deviceRepository;
        this.modelMapper = modelMapper;
        this.systemsRepository = systemsRepository;
        this.locationRepository = locationRepository;
        this.deviceTypeRepository = deviceTypeRepository;
        this.systemMaintenanceServiceRepository = systemMaintenanceServiceRepository;
    }

    public ResultPaginationDTO getAllDevices(Specification<Device> spec,
                                                           Pageable pageable) {

        Page<Device> page = deviceRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<DeviceDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, DeviceDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public DeviceDto createDevice(Device device) {
        // Check System
        if (device.getSystem() != null) {
            Systems systems = systemsRepository.findById(device.getSystem().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System not found with ID: " + device.getSystem().getId()));
            device.setSystem(systems);
        }

        // Check Location
        if (device.getLocation() != null) {
            Location location = locationRepository.findById(device.getLocation().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + device.getLocation().getId()));
            device.setLocation(location);
        }

        // Check Device Type
        if (device.getDeviceType() != null) {
            DeviceType deviceType = deviceTypeRepository.findById(device.getDeviceType().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + device.getDeviceType().getId()));
            device.setDeviceType(deviceType);
        }

        // Check System Maintenance Service
        if (device.getMaintenanceService() != null) {
            SystemMaintenanceService systemMaintenanceService = systemMaintenanceServiceRepository.findById(device.getMaintenanceService().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance service not found with ID: " + device.getMaintenanceService().getId()));
            device.setMaintenanceService(systemMaintenanceService);
        }

        return modelMapper.map(deviceRepository.save(device), DeviceDto.class);
    }

    public DeviceDto getDevice(Long id) {
        Device ex = deviceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + id));

        return modelMapper.map(ex, DeviceDto.class);
    }

    public DeviceDto updateDevice(Long id, Device device) {
        Device ex = deviceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + id));

        // Check System
        if (device.getSystem() != null) {
            Systems systems = systemsRepository.findById(device.getSystem().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System not found with ID: " + device.getSystem().getId()));
            device.setSystem(systems);
        }

        // Check Location
        if (device.getLocation() != null) {
            Location location = locationRepository.findById(device.getLocation().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + device.getLocation().getId()));
            device.setLocation(location);
        }

        // Check Device Type
        if (device.getDeviceType() != null) {
            DeviceType deviceType = deviceTypeRepository.findById(device.getDeviceType().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + device.getDeviceType().getId()));
            device.setDeviceType(deviceType);
        }

        // Check System Maintenance Service
        if (device.getMaintenanceService() != null) {
            SystemMaintenanceService systemMaintenanceService = systemMaintenanceServiceRepository.findById(device.getMaintenanceService().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance service not found with ID: " + device.getMaintenanceService().getId()));
            device.setMaintenanceService(systemMaintenanceService);
        }

        ex.setSystem(device.getSystem());
        ex.setLocation(device.getLocation());
        ex.setDeviceType(device.getDeviceType());
        ex.setDeviceName(device.getDeviceName());
        ex.setInstallationDate(device.getInstallationDate());
        ex.setLifespan(device.getLifespan());
        ex.setStatus(device.getStatus());
        ex.setMaintenanceService(device.getMaintenanceService());

        return modelMapper.map(deviceRepository.save(ex), DeviceDto.class);
    }

    public void deleteDevice(Long id) {
        Device ex = deviceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + id));

        deviceRepository.delete(ex);
    }
}
