package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.MaintenanceHistoryDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.property_manager.MaintenanceHistory;
import com.building_mannager_system.entity.property_manager.SystemMaintenanceService;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.system_manager.MaintenanceHistoryRepository;
import com.building_mannager_system.repository.system_manager.SystemMaintenanceServiceRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class MaintenanceHistoryService {
    private final MaintenanceHistoryRepository maintenanceHistoryRepository;
    private final ModelMapper modelMapper;
    private final SystemMaintenanceServiceRepository systemMaintenanceServiceRepository;
    private final UserRepository userRepository;

    public MaintenanceHistoryService(MaintenanceHistoryRepository maintenanceHistoryRepository,
                                     ModelMapper modelMapper,
                                     SystemMaintenanceServiceRepository systemMaintenanceServiceRepository,
                                     UserRepository userRepository) {
        this.maintenanceHistoryRepository = maintenanceHistoryRepository;
        this.modelMapper = modelMapper;
        this.systemMaintenanceServiceRepository = systemMaintenanceServiceRepository;
        this.userRepository = userRepository;
    }

    public ResultPaginationDTO getAllMaintenanceHistories(Specification<MaintenanceHistory> spec,
                                             Pageable pageable) {

        Page<MaintenanceHistory> page = maintenanceHistoryRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        return rs;
    }

    public MaintenanceHistoryDto createMaintenanceHistory(MaintenanceHistory maintenanceHistory) {
        // Check System Maintenance Service
        if (maintenanceHistory.getMaintenanceService() != null) {
            SystemMaintenanceService systemMaintenanceService = systemMaintenanceServiceRepository.findById(maintenanceHistory.getMaintenanceService().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System maintenance service not found with ID: " + maintenanceHistory.getMaintenanceService().getId()));
            maintenanceHistory.setMaintenanceService(systemMaintenanceService);
        }

        // Check Technician
        if (maintenanceHistory.getTechnician() != null) {
            User user = userRepository.findById(maintenanceHistory.getTechnician().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Technician not found with ID: " + maintenanceHistory.getTechnician().getId()));
            maintenanceHistory.setTechnician(user);
        }

        return modelMapper.map(maintenanceHistoryRepository.save(maintenanceHistory), MaintenanceHistoryDto.class);
    }

    public MaintenanceHistoryDto getMaintenanceHistory(Long id) {
        MaintenanceHistory maintenanceHistory = maintenanceHistoryRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance history not found with ID: " + id));

        return modelMapper.map(maintenanceHistoryRepository.save(maintenanceHistory), MaintenanceHistoryDto.class);
    }

    public MaintenanceHistoryDto updateMaintenanceHistory(Long id, MaintenanceHistory maintenanceHistory) {
        MaintenanceHistory ex = maintenanceHistoryRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance history not found with ID: " + id));

        // Check System Maintenance Service
        if (maintenanceHistory.getMaintenanceService() != null) {
            SystemMaintenanceService systemMaintenanceService = systemMaintenanceServiceRepository.findById(maintenanceHistory.getMaintenanceService().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System maintenance service not found with ID: " + maintenanceHistory.getMaintenanceService().getId()));
            maintenanceHistory.setMaintenanceService(systemMaintenanceService);
        }

        // Check Technician
        if (maintenanceHistory.getTechnician() != null) {
            User user = userRepository.findById(maintenanceHistory.getTechnician().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Technician not found with ID: " + maintenanceHistory.getTechnician().getId()));
            maintenanceHistory.setTechnician(user);
        }

        ex.setMaintenanceService(maintenanceHistory.getMaintenanceService());
        ex.setPerformedDate(maintenanceHistory.getPerformedDate());
        ex.setNotes(maintenanceHistory.getNotes());
        ex.setTechnician(maintenanceHistory.getTechnician());
        ex.setFindings(maintenanceHistory.getFindings());
        ex.setResolution(maintenanceHistory.getResolution());
        ex.setPhone(maintenanceHistory.getPhone());

        return modelMapper.map(maintenanceHistoryRepository.save(ex), MaintenanceHistoryDto.class);
    }

    public void deleteMaintenanceHistory(Long id) {
        MaintenanceHistory maintenanceHistory = maintenanceHistoryRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance history not found with ID: " + id));

        maintenanceHistoryRepository.delete(maintenanceHistory);
    }
}
