package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.LocationDto;
import com.building_mannager_system.dto.requestDto.propertyDto.SystemMaintenanceServiceDto;
import com.building_mannager_system.entity.property_manager.Subcontractor;
import com.building_mannager_system.entity.property_manager.SystemMaintenanceService;
import com.building_mannager_system.repository.system_manager.SubcontractorsRepository;
import com.building_mannager_system.repository.system_manager.SystemMaintenanceServiceRepository;
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
public class SystemMaintenanceService_Service {
    private final SystemMaintenanceServiceRepository systemMaintenanceServiceRepository;
    private final ModelMapper modelMapper;
    private final SubcontractorsRepository subcontractorsRepository;

    public SystemMaintenanceService_Service(SystemMaintenanceServiceRepository systemMaintenanceServiceRepository,
                                            ModelMapper modelMapper, SubcontractorsRepository subcontractorsRepository) {
        this.systemMaintenanceServiceRepository = systemMaintenanceServiceRepository;
        this.modelMapper = modelMapper;
        this.subcontractorsRepository = subcontractorsRepository;
    }

    public ResultPaginationDTO getAllSystemMaintenanceServices(Specification<SystemMaintenanceService> spec,
                                              Pageable pageable) {

        Page<SystemMaintenanceService> page = systemMaintenanceServiceRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<SystemMaintenanceServiceDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, SystemMaintenanceServiceDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);


        return rs;
    }

    public SystemMaintenanceServiceDto createSystemMaintenanceService(SystemMaintenanceService systemMaintenanceService) {
        // Check Subcontractor
        if (systemMaintenanceService.getSubcontractor() != null) {
            Subcontractor subcontractor = subcontractorsRepository.findById(systemMaintenanceService.getSubcontractor().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontract not found with ID: " + systemMaintenanceService.getSubcontractor().getId()));
            systemMaintenanceService.setSubcontractor(subcontractor);
        }

        return modelMapper.map(systemMaintenanceServiceRepository.save(systemMaintenanceService), SystemMaintenanceServiceDto.class);
    }

    public SystemMaintenanceServiceDto getSystemMaintenanceService(Long id) {
        SystemMaintenanceService systemMaintenanceService = systemMaintenanceServiceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontract not found with ID: " + id));

        return modelMapper.map(systemMaintenanceService, SystemMaintenanceServiceDto.class);
    }

    public SystemMaintenanceServiceDto updateSystemMaintenanceService(Long id, SystemMaintenanceService systemMaintenanceService) {
        SystemMaintenanceService ex = systemMaintenanceServiceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontract not found with ID: " + id));

        // Check Subcontractor
        if (systemMaintenanceService.getSubcontractor() != null) {
            Subcontractor subcontractor = subcontractorsRepository.findById(systemMaintenanceService.getSubcontractor().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontract not found with ID: " + systemMaintenanceService.getSubcontractor().getId()));
            systemMaintenanceService.setSubcontractor(subcontractor);
        }

        ex.setSubcontractor(systemMaintenanceService.getSubcontractor());
        ex.setServiceType(systemMaintenanceService.getServiceType());
        ex.setMaintenanceScope(systemMaintenanceService.getMaintenanceScope());
        ex.setFrequency(systemMaintenanceService.getFrequency());
        ex.setNextScheduledDate(systemMaintenanceService.getNextScheduledDate());
        ex.setStatus(systemMaintenanceService.getStatus());

        return modelMapper.map(systemMaintenanceServiceRepository.save(ex), SystemMaintenanceServiceDto.class);
    }

    public void deleteSystemMaintenanceService(Long id) {
        SystemMaintenanceService systemMaintenanceService = systemMaintenanceServiceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontract not found with ID: " + id));

        systemMaintenanceServiceRepository.delete(systemMaintenanceService);
    }
}
