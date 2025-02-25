package com.building_mannager_system.service.work_registration;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.entity.work_registration.RepairRequest;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.work_registration.RepairRequestRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.service.notification.NotificationService;
import com.building_mannager_system.service.notification.RecipientService;
import com.building_mannager_system.untils.JsonUntils;
import com.building_mannager_system.utils.exception.APIException;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepairRequestService {
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "repair_requests";
    List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx", "rar", "webp");

    private final UserRepository userRepository;
    private final RecipientService recipientService;
    private final NotificationService notificationService;
    private final RepairRequestRepository repairRequestRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    private final SimpMessagingTemplate messagingTemplate;

    public RepairRequestService(RepairRequestRepository repairRequestRepository,
                                ModelMapper modelMapper,
                                FileService fileService,
                                UserRepository userRepository,
                                RecipientService recipientService,
                                NotificationService notificationService,
                                SimpMessagingTemplate messagingTemplate) {
        this.repairRequestRepository = repairRequestRepository;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.userRepository = userRepository;
        this.recipientService = recipientService;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
    }

    // ✅ Tạo mới RepairRequest
    public RepairRequestDto createRepairRequest(MultipartFile image, RepairRequest repairRequest) {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User account = userRepository.findByEmail(email);

        fileService.validateFile(image, allowedExtensions);
        repairRequest.setImageUrl(fileService.storeFile(image, folder));

        repairRequest.setAccount(account);

        repairRequest = repairRequestRepository.saveAndFlush(repairRequest);

        // Tạo JSON message
        String message = null;
        try {
            message = JsonUntils.toJson(modelMapper.map(repairRequest, RepairRequestDto.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        List<String> roles = List.of("Application_Admin", "Technician_Manager", "Technician_Employee");
        List<User> recipients = userRepository.findByRole_NameIn(roles);

        if (recipients.isEmpty()) {
            return null;
        }

        for (User user : recipients) {
            Recipient rec = new Recipient();
            rec.setType("Repair_Request_Notification");
            rec.setName("Send Repair Request Notification");
            rec.setReferenceId(user.getId());

            Recipient recipient = recipientService.createRecipient(rec);

            Notification notification = new Notification();
            notification.setRecipient(recipient);
            notification.setMessage(message);
            notification.setStatus(StatusNotifi.PENDING);
            notification.setCreatedAt(LocalDateTime.now());

            notificationService.createNotification(notification);
            messagingTemplate.convertAndSend("/topic/repair-request-notifications/" + user.getId(), message);
        }

        return modelMapper.map(repairRequest, RepairRequestDto.class);
    }

    // ✅ Lấy tất cả RepairRequests
    public ResultPaginationDTO getAllRepairRequests(Specification<RepairRequest> spec,
                                                    Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().orElse("");

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new APIException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (user.getRole().getName().equals("Customer")) {
            spec = Specification.where((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("account").get("id"), user.getId()));
        }

        Page<RepairRequest> page = repairRequestRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<RepairRequestDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, RepairRequestDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    // ✅ Lấy RepairRequest theo ID
    public RepairRequestDto getRepairRequest(Long id) {
        RepairRequest repairRequest = repairRequestRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair Request not found with ID: " + id));
        return modelMapper.map(repairRequest, RepairRequestDto.class);
    }


    // ✅ Cập nhật RepairRequest
    public RepairRequestDto updateRepairRequest(Long id, MultipartFile image, RepairRequest repairRequest) throws URISyntaxException {
        RepairRequest ex = repairRequestRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair Request not found with ID: " + id));

        if (image != null && !image.isEmpty()) {
            fileService.validateFile(image, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getImageUrl() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getImageUrl());
            }

            // Lưu tệp mới
            ex.setImageUrl(fileService.storeFile(image, folder));
        }

        ex.setContent(repairRequest.getContent());
        ex.setStatus(repairRequest.getStatus());
        ex.setRequestDate(repairRequest.getRequestDate());

        return modelMapper.map(repairRequestRepository.save(ex), RepairRequestDto.class);
    }

    // ✅ Xóa RepairRequest
    public void deleteRepairRequest(Long id) throws URISyntaxException {
        RepairRequest ex = repairRequestRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair Request not found with ID: " + id));

        if (ex.getImageUrl() != null) {
            fileService.deleteFile(baseURI + folder + "/" + ex.getImageUrl());
        }

        repairRequestRepository.delete(ex);
    }
}
