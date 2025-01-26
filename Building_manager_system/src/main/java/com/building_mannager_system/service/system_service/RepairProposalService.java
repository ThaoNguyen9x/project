package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.RepairProposalDto;
import com.building_mannager_system.entity.property_manager.RepairProposal;
import com.building_mannager_system.entity.property_manager.RiskAssessment;
import com.building_mannager_system.repository.system_manager.RepairProposalRepository;
import com.building_mannager_system.repository.system_manager.RiskAssessmentRepository;
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
public class RepairProposalService {
    private final RepairProposalRepository repairProposalRepository;
    private final ModelMapper modelMapper;
    private final RiskAssessmentRepository riskAssessmentRepository;

    public RepairProposalService(RepairProposalRepository repairProposalRepository,
                                 ModelMapper modelMapper, RiskAssessmentRepository riskAssessmentRepository) {
        this.repairProposalRepository = repairProposalRepository;
        this.modelMapper = modelMapper;
        this.riskAssessmentRepository = riskAssessmentRepository;
    }

    public ResultPaginationDTO getAllRepairProposals(Specification<RepairProposal> spec,
                                               Pageable pageable) {

        Page<RepairProposal> page = repairProposalRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<RepairProposalDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, RepairProposalDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public RepairProposalDto createRepairProposal(RepairProposal repairProposal) {
        // Check customerType
        if (repairProposal.getRiskAssessment() != null) {
            RiskAssessment riskAssessment = riskAssessmentRepository.findById(repairProposal.getRiskAssessment().getRiskAssessmentID())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Risk assessment not found with ID: " + repairProposal.getRiskAssessment().getRiskAssessmentID()));
            repairProposal.setRiskAssessment(riskAssessment);
        }

        return modelMapper.map(repairProposalRepository.save(repairProposal), RepairProposalDto.class);
    }

    public RepairProposalDto getRepairProposal(Long id) {
        RepairProposal ex = repairProposalRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair proposal not found with ID: " + id));

        return modelMapper.map(ex, RepairProposalDto.class);
    }

    public void deleteRepairProposal(Long id) {
        RepairProposal ex = repairProposalRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair proposal not found with ID: " + id));

        repairProposalRepository.delete(ex);
    }

    public RepairProposalDto updateRepairProposal(Long id, RepairProposal repairProposal) {
        RepairProposal ex = repairProposalRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair proposal not found with ID: " + id));

        // Check customerType
        if (repairProposal.getRiskAssessment() != null) {
            RiskAssessment riskAssessment = riskAssessmentRepository.findById(repairProposal.getRiskAssessment().getRiskAssessmentID())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Risk assessment not found with ID: " + repairProposal.getRiskAssessment().getRiskAssessmentID()));
            repairProposal.setRiskAssessment(riskAssessment);
        }

        ex.setTitle(repairProposal.getTitle());
        ex.setDescription(repairProposal.getDescription());
        ex.setRequestDate(repairProposal.getRequestDate());
        ex.setPriority(repairProposal.getPriority());
        ex.setProposalType(repairProposal.getProposalType());
        ex.setRiskAssessment(repairProposal.getRiskAssessment());
        ex.setStatus(repairProposal.getStatus());

        return modelMapper.map(repairProposalRepository.save(ex), RepairProposalDto.class);
    }
}