package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.RiskAssessmentDto;
import com.building_mannager_system.entity.property_manager.*;
import com.building_mannager_system.repository.system_manager.DeviceRepository;
import com.building_mannager_system.repository.system_manager.MaintenanceHistoryRepository;
import com.building_mannager_system.repository.system_manager.RiskAssessmentRepository;
import com.building_mannager_system.repository.system_manager.SubcontractorsRepository;
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
public class RiskAssessmentService {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final ModelMapper modelMapper;
    private final MaintenanceHistoryRepository maintenanceHistoryRepository;
    private final DeviceRepository deviceRepository;
    private final SubcontractorsRepository subcontractorsRepository;

    public RiskAssessmentService(RiskAssessmentRepository riskAssessmentRepository,
                                 ModelMapper modelMapper, MaintenanceHistoryRepository maintenanceHistoryRepository, DeviceRepository deviceRepository, SubcontractorsRepository subcontractorsRepository) {
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.modelMapper = modelMapper;
        this.maintenanceHistoryRepository = maintenanceHistoryRepository;
        this.deviceRepository = deviceRepository;
        this.subcontractorsRepository = subcontractorsRepository;
    }

    public ResultPaginationDTO getAllRiskAssessments(Specification<RiskAssessment> spec,
                                             Pageable pageable) {

        Page<RiskAssessment> page = riskAssessmentRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<RiskAssessmentDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, RiskAssessmentDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public RiskAssessmentDto createRiskAssessment(RiskAssessment riskAssessment) {
        // Check Maintenance History
        if (riskAssessment.getMaintenanceHistory() != null) {
            MaintenanceHistory maintenanceHistory = maintenanceHistoryRepository.findById(riskAssessment.getMaintenanceHistory().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance history not found with ID: " + riskAssessment.getMaintenanceHistory().getId()));
            riskAssessment.setMaintenanceHistory(maintenanceHistory);
        }

        // Check Subcontractor
        if (riskAssessment.getContractor() != null) {
            Subcontractor subcontractor = subcontractorsRepository.findById(riskAssessment.getContractor().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontractor not found with ID: " + riskAssessment.getContractor().getId()));
            riskAssessment.setContractor(subcontractor);
        }

        // Check Device
        if (riskAssessment.getDevice() != null) {
            Device device = deviceRepository.findById(riskAssessment.getDevice().getDeviceId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + riskAssessment.getDevice().getDeviceId()));
            riskAssessment.setDevice(device);
        }

        riskAssessment.setRiskPriorityNumber(riskAssessment.getRiskProbability() * riskAssessment.getRiskImpact() * riskAssessment.getRiskDetection());

        return modelMapper.map(riskAssessmentRepository.save(riskAssessment), RiskAssessmentDto.class);
    }

    public RiskAssessmentDto getRiskAssessment(int id) {
        RiskAssessment ex = riskAssessmentRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Risk assessment not found with ID: " + id));

        return modelMapper.map(ex, RiskAssessmentDto.class);
    }

    public RiskAssessmentDto updateRiskAssessment(int id, RiskAssessment riskAssessment) {
        RiskAssessment ex = riskAssessmentRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Risk assessment not found with ID: " + id));

        // Check Maintenance History
        if (riskAssessment.getMaintenanceHistory() != null) {
            MaintenanceHistory maintenanceHistory = maintenanceHistoryRepository.findById(riskAssessment.getMaintenanceHistory().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance history not found with ID: " + riskAssessment.getMaintenanceHistory().getId()));
            riskAssessment.setMaintenanceHistory(maintenanceHistory);
        }

        // Check Subcontractor
        if (riskAssessment.getContractor() != null) {
            Subcontractor subcontractor = subcontractorsRepository.findById(riskAssessment.getContractor().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontractor not found with ID: " + riskAssessment.getContractor().getId()));
            riskAssessment.setContractor(subcontractor);
        }

        // Check Device
        if (riskAssessment.getDevice() != null) {
            Device device = deviceRepository.findById(riskAssessment.getDevice().getDeviceId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + riskAssessment.getDevice().getDeviceId()));
            riskAssessment.setDevice(device);
        }

        ex.setMaintenanceHistory(riskAssessment.getMaintenanceHistory());
        ex.setContractor(riskAssessment.getContractor());
        ex.setSystemType(riskAssessment.getSystemType());
        ex.setDevice(riskAssessment.getDevice());
        ex.setAssessmentDate(riskAssessment.getAssessmentDate());
        ex.setRiskProbability(riskAssessment.getRiskProbability());
        ex.setRiskImpact(riskAssessment.getRiskImpact());
        ex.setRiskDetection(riskAssessment.getRiskDetection());
        ex.setRiskPriorityNumber(riskAssessment.getRiskProbability() * riskAssessment.getRiskImpact() * riskAssessment.getRiskDetection());
        ex.setMitigationAction(riskAssessment.getMitigationAction());
        ex.setRemarks(riskAssessment.getRemarks());

        return modelMapper.map(riskAssessmentRepository.save(ex), RiskAssessmentDto.class);
    }

    public void deleteRiskAssessment(int id) {
        RiskAssessment ex = riskAssessmentRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Risk assessment not found with ID: " + id));

        riskAssessmentRepository.delete(ex);
    }
}
