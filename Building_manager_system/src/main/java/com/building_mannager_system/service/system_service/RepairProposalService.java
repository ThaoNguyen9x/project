package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.RepairProposalDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.entity.property_manager.RepairProposal;
import com.building_mannager_system.entity.property_manager.RiskAssessment;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.system_manager.RepairProposalRepository;
import com.building_mannager_system.repository.system_manager.RiskAssessmentRepository;
import com.building_mannager_system.service.notification.NotificationService;
import com.building_mannager_system.service.notification.RecipientService;
import com.building_mannager_system.untils.JsonUntils;
import com.building_mannager_system.utils.exception.APIException;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepairProposalService {
    private final RepairProposalRepository repairProposalRepository;
    private final ModelMapper modelMapper;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final RecipientService recipientService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public RepairProposalService(RepairProposalRepository repairProposalRepository,
                                 ModelMapper modelMapper,
                                 RiskAssessmentRepository riskAssessmentRepository,
                                 RecipientService recipientService,
                                 UserRepository userRepository,
                                 NotificationService notificationService,
                                 SimpMessagingTemplate messagingTemplate) {
        this.repairProposalRepository = repairProposalRepository;
        this.modelMapper = modelMapper;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.recipientService = recipientService;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
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
        // Validate risk assessment if exists
        if (repairProposal.getRiskAssessment() != null) {
            RiskAssessment riskAssessment = riskAssessmentRepository.findById(repairProposal.getRiskAssessment().getRiskAssessmentID())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Risk assessment not found with ID: " + repairProposal.getRiskAssessment().getRiskAssessmentID()));
            repairProposal.setRiskAssessment(riskAssessment);
        }

        RepairProposal repair = repairProposalRepository.saveAndFlush(repairProposal);

        // Find admin users
        List<String> roles = List.of("Application_Admin", "Technician_Manager");
        List<User> recipients = userRepository.findByRole_NameIn(roles);

        if (recipients.isEmpty()) {
            return null;
        }

        String message = null;
        try {
            message = JsonUntils.toJson(modelMapper.map(repair, RepairProposalDto.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        LocalDateTime timestamp = LocalDateTime.now();

        for (User user : recipients) {
            // Create recipient
            Recipient rec = new Recipient();
            rec.setType("Repair_Proposal_Notification");
            rec.setName("Send Repair Proposal Notification");
            rec.setReferenceId(user.getId());

            Recipient recipient = recipientService.createRecipient(rec);

            // Create notification
            Notification notification = new Notification();
            notification.setRecipient(recipient);
            notification.setMessage(message);
            notification.setStatus(StatusNotifi.PENDING);
            notification.setCreatedAt(timestamp);

            notificationService.createNotification(notification);

            messagingTemplate.convertAndSend("/topic/repair-proposal-notifications/" + user.getId(), message);
        }

        return modelMapper.map(repair, RepairProposalDto.class);
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