package com.building_mannager_system.service.work_registration;


import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.dto.requestDto.work_registration.WorkRegistrationDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.entity.work_registration.RepairRequest;
import com.building_mannager_system.entity.work_registration.WorkRegistration;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.enums.WorkStatus;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.work_registration.WorkRegistrationRepository;
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
public class WorkRegistrationService {

    private final NotificationService notificationService;
    private final RecipientService recipientService;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "work_registrations";
    List<String> allowedExtensions = Arrays.asList("pdf");

    private final WorkRegistrationRepository workRegistrationRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public WorkRegistrationService(WorkRegistrationRepository workRegistrationRepository,
                                   ModelMapper modelMapper,
                                   FileService fileService,
                                   UserRepository userRepository,
                                   NotificationService notificationService,
                                   RecipientService recipientService,
                                   SimpMessagingTemplate messagingTemplate) {
        this.workRegistrationRepository = workRegistrationRepository;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.recipientService = recipientService;
        this.messagingTemplate = messagingTemplate;
    }

    public WorkRegistrationDto createWorkRegistration(MultipartFile image, WorkRegistration workRegistration) {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User account = userRepository.findByEmail(email);

        fileService.validateFile(image, allowedExtensions);
        workRegistration.setDrawingUrl(fileService.storeFile(image, folder));

        workRegistration.setAccount(account);
        workRegistration = workRegistrationRepository.saveAndFlush(workRegistration);

        // Tạo JSON message
        String message = null;
        try {
            message = JsonUntils.toJson(modelMapper.map(workRegistration, WorkRegistrationDto.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        List<String> roles = List.of("Application_Admin", "Technician_Manager");
        List<User> recipients = userRepository.findByRole_NameIn(roles);

        if (recipients.isEmpty()) {
            return null;
        }

        for (User user : recipients) {
            Recipient rec = new Recipient();
            rec.setType("Work_Registration_Notification");
            rec.setName("Send Work Registration Notification");
            rec.setReferenceId(user.getId());

            Recipient recipient = recipientService.createRecipient(rec);

            Notification notification = new Notification();
            notification.setRecipient(recipient);
            notification.setMessage(message);
            notification.setStatus(StatusNotifi.PENDING);
            notification.setCreatedAt(LocalDateTime.now());

            notificationService.createNotification(notification);
            messagingTemplate.convertAndSend("/topic/work-registration-notifications/" + user.getId(), message);
        }

        return modelMapper.map(workRegistration, WorkRegistrationDto.class);
    }

    // ✅ Lấy tất cả
    public ResultPaginationDTO getAllWorkRegistrations(Specification<WorkRegistration> spec,
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

        Page<WorkRegistration> page = workRegistrationRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<WorkRegistrationDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, WorkRegistrationDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    // ✅ Lấy theo ID
    public WorkRegistrationDto getWorkRegistration(int id) {
        WorkRegistration workRegistration = workRegistrationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Work registration not found with ID: " + id));

        return modelMapper.map(workRegistration, WorkRegistrationDto.class);
    }

    // ✅ Cập nhật trạng thái công việc
    public WorkRegistrationDto updateWorkRegistration(int id, MultipartFile image, WorkRegistration workRegistration) throws URISyntaxException {
        // Tìm kiếm bản ghi dựa trên ID
        WorkRegistration ex = workRegistrationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Work registration not found with ID: " + id));

        if (image != null && !image.isEmpty()) {
            fileService.validateFile(image, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getDrawingUrl() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getDrawingUrl());
            }

            // Lưu tệp mới
            ex.setDrawingUrl(fileService.storeFile(image, folder));
        }

        ex.setScheduledDate(workRegistration.getScheduledDate());
        ex.setStatus(workRegistration.getStatus());
        ex.setNote(workRegistration.getNote());

        return modelMapper.map(workRegistrationRepository.save(ex), WorkRegistrationDto.class);
    }

    // ✅ Xóa
    public void deleteWorkRegistration(int id) throws URISyntaxException {
        WorkRegistration ex = workRegistrationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Work registration not found with ID: " + id));

        if (ex.getDrawingUrl() != null) {
            fileService.deleteFile(baseURI + folder + "/" + ex.getDrawingUrl());
        }

        workRegistrationRepository.delete(ex);
    }
}
