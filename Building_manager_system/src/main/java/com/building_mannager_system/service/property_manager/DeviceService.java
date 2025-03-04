package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.*;
import com.building_mannager_system.dto.responseDto.DeviceResponceDto;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.property_manager.*;
import com.building_mannager_system.repository.office.LocationRepository;
import com.building_mannager_system.repository.system_manager.DeviceRepository;
import com.building_mannager_system.repository.system_manager.DeviceTypeRepository;
import com.building_mannager_system.repository.system_manager.SystemMaintenanceServiceRepository;
import com.building_mannager_system.repository.system_manager.SystemsRepository;
import com.building_mannager_system.service.system_service.RiskAssessmentService;
import com.building_mannager_system.utils.exception.APIException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    private final MaintenanceHistoryService maintenanceHistoryService;
    private final RiskAssessmentService riskAssessmentService;

    public DeviceService(DeviceRepository deviceRepository,
                         ModelMapper modelMapper,
                         SystemsRepository systemsRepository,
                         LocationRepository locationRepository,
                         DeviceTypeRepository deviceTypeRepository,
                         SystemMaintenanceServiceRepository systemMaintenanceServiceRepository, MaintenanceHistoryService maintenanceHistoryService, RiskAssessmentService riskAssessmentService) {
        this.deviceRepository = deviceRepository;
        this.modelMapper = modelMapper;
        this.systemsRepository = systemsRepository;
        this.locationRepository = locationRepository;
        this.deviceTypeRepository = deviceTypeRepository;
        this.systemMaintenanceServiceRepository = systemMaintenanceServiceRepository;
        this.maintenanceHistoryService = maintenanceHistoryService;
        this.riskAssessmentService = riskAssessmentService;
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
        ex.setX(device.getX());
        ex.setY(device.getY());

        return modelMapper.map(deviceRepository.save(ex), DeviceDto.class);
    }

    public void deleteDevice(Long id) {
        Device ex = deviceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + id));

        deviceRepository.delete(ex);
    }

    //luongth thêm đánh g và maintenance_hítory
    @Transactional
    public DeviceDto addRiskAssessmentAndMaintenanceHistoryToDevice(Long deviceId,
                                                                    RissAssementRequesFlutterDto riskAssessmentFlutterDto,
                                                                    MaintenanceRepuestFlutterDto maintenanceHistoryFlutterDto) {

        // ✅ Bước 1: Validate tham số đầu vào
        System.out.println(deviceId);
        System.out.println(riskAssessmentFlutterDto);
        System.out.println(maintenanceHistoryFlutterDto);

        if (deviceId == null) {
            throw new IllegalArgumentException("Device ID không được null");
        }
        if (maintenanceHistoryFlutterDto == null) {
            throw new IllegalArgumentException("MaintenanceHistory không được null");
        }
        if (riskAssessmentFlutterDto == null) {
            throw new IllegalArgumentException("RiskAssessment không được null");
        }

        // ✅ Bước 2: Tìm Device theo ID
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device không tìm thấy với ID: " + deviceId));

        // ✅ Bước 3: Ánh xạ DTO -> Entity và lưu MaintenanceHistory
        System.out.println(device);
        MaintenanceHistory maintenanceHistory = modelMapper.map(maintenanceHistoryFlutterDto, MaintenanceHistory.class);
        System.out.println(maintenanceHistory.getId());

        maintenanceHistory.setPerformedDate(LocalDate.now());
        MaintenanceHistoryDto savedMaintenanceHistory = maintenanceHistoryService.createMaintenanceHistory(maintenanceHistory);

        if (savedMaintenanceHistory == null || savedMaintenanceHistory.getId() == null) {
            throw new RuntimeException("Không thể lưu MaintenanceHistory");
        }

        // ✅ Bước 4: Cập nhật ID của MaintenanceHistory vào RiskAssessment DTO
        riskAssessmentFlutterDto.setMaintenanceID(savedMaintenanceHistory.getId().intValue());

        // ✅ Bước 5: Ánh xạ DTO -> Entity và lưu RiskAssessment
        RiskAssessment riskAssessment = modelMapper.map(riskAssessmentFlutterDto, RiskAssessment.class);
        riskAssessment.setDevice(device);
        riskAssessment.setAssessmentDate(LocalDate.now());
        riskAssessment.setMaintenanceHistory(maintenanceHistory);

        RiskAssessmentDto savedRiskAssessment = riskAssessmentService.createRiskAssessment(riskAssessment);

        if (savedRiskAssessment == null || savedRiskAssessment.getRiskAssessmentID() == null) {
            throw new RuntimeException("Không thể lưu RiskAssessment");
        }

        // ✅ Bước 6: Chuyển Device sang DTO và trả về
        return modelMapper.map(device, DeviceDto.class);
    }

    // device responce bu flutter
    public DeviceResponceDto getDeviceResponce(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Device not found with id: " + id));
        return modelMapper.map(device, DeviceResponceDto.class);
    }
}
