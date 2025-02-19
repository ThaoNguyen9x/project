package com.building_mannager_system.service.notification;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.notificationDto.NotificationMaintenanceDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.NotificationMaintenance;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.entity.property_manager.MaintenanceTask;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.notification.MaintenanceTaskRepository;
import com.building_mannager_system.repository.notification.NotificationMaintenanceRepository;
import com.building_mannager_system.repository.notification.NotificationRepository;
import com.building_mannager_system.repository.notification.RecipientRepository;
import com.building_mannager_system.service.websocket.WebsocketService;
import com.building_mannager_system.untils.JsonUntils;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationMaintenanceService {

    private final NotificationMaintenanceRepository notificationMaintenanceRepository;
    private final WebsocketService websocketService;
    private final ModelMapper modelMapper;
    private final MaintenanceTaskRepository maintenanceTaskRepository;
    private final UserRepository userRepository;
    private final RecipientService recipientService;
    private final NotificationRepository notificationRepository;
    private final RecipientRepository recipientRepository;

    public NotificationMaintenanceService(NotificationMaintenanceRepository notificationMaintenanceRepository,
                                          WebsocketService websocketService,
                                          ModelMapper modelMapper, MaintenanceTaskRepository maintenanceTaskRepository, UserRepository userRepository, RecipientService recipientService, NotificationRepository notificationRepository, RecipientRepository recipientRepository) {
        this.notificationMaintenanceRepository = notificationMaintenanceRepository;
        this.websocketService = websocketService;
        this.modelMapper = modelMapper;
        this.maintenanceTaskRepository = maintenanceTaskRepository;
        this.userRepository = userRepository;
        this.recipientService = recipientService;
        this.notificationRepository = notificationRepository;
        this.recipientRepository = recipientRepository;
    }

    public ResultPaginationDTO getAllNotifications(Specification<NotificationMaintenance> spec,
                                                   Pageable pageable) {

        Page<NotificationMaintenance> page = notificationMaintenanceRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<NotificationMaintenanceDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, NotificationMaintenanceDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public NotificationMaintenanceDto createNotification(NotificationMaintenance notificationMaintenance) {
        // Check Maintenance Task
        if (notificationMaintenance.getMaintenanceTask() != null) {
            MaintenanceTask maintenanceTask = maintenanceTaskRepository.findById(notificationMaintenance.getMaintenanceTask().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance task not found with ID: " + notificationMaintenance.getMaintenanceTask().getId()));
            notificationMaintenance.setMaintenanceTask(maintenanceTask);
        }

        NotificationMaintenance no = notificationMaintenanceRepository.saveAndFlush(notificationMaintenance);

        List<String> roles = List.of("Technician_Manager", "Technician_Employee");
        List<User> recipients = userRepository.findByRole_NameIn(roles);

        if (recipients.isEmpty()) return null;

        String message;
        try {
            message = JsonUntils.toJson(no);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        for (User recipientUser : recipients) {
            List<Recipient> existingRecipients = recipientRepository.findByReferenceId(recipientUser.getId());

            Recipient existingRecipient = null;
            if (existingRecipients != null && !existingRecipients.isEmpty()) {
                existingRecipient = existingRecipients.get(0);
            }

            if (existingRecipient == null) {
                Recipient rec = new Recipient();
                rec.setType("Maintenance_Task_Notification");
                rec.setName("Send Maintenance Task Notification");
                rec.setReferenceId(recipientUser.getId());
                existingRecipient = recipientService.createRecipient(rec);
            }

            Notification notification = new Notification();
            notification.setRecipient(existingRecipient);
            notification.setMessage(message);
            notification.setStatus(StatusNotifi.PENDING);
            notification.setCreatedAt(LocalDateTime.now());

            notificationRepository.save(notification);

            try {
                websocketService.sendNotificationToRecipients(recipientUser.getId(), notificationMaintenance);
            } catch (Exception e) {
                System.err.println("Error sending WebSocket notification for user ID: " + recipientUser.getId() + ", " + e.getMessage());
            }
        }

        return modelMapper.map(no, NotificationMaintenanceDto.class);
    }

    public NotificationMaintenanceDto updateNotification(Long id, NotificationMaintenance notificationMaintenance) {
        NotificationMaintenance ex = notificationMaintenanceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Notification maintenance not found with ID: " + id));

        if (notificationMaintenance.getMaintenanceTask() != null) {
            MaintenanceTask maintenanceTask = maintenanceTaskRepository.findById(notificationMaintenance.getMaintenanceTask().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance task not found with ID: " + notificationMaintenance.getMaintenanceTask().getId()));
            notificationMaintenance.setMaintenanceTask(maintenanceTask);
        }

        List<String> roles = List.of("Customer");
        List<User> recipients = userRepository.findByRole_NameIn(roles);

        if (recipients.isEmpty()) return null;

        String message;
        try {
            message = JsonUntils.toJson(notificationMaintenance);
        } catch (Exception e) {
            throw new APIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error serializing notification message", e);
        }

        for (User recipientUser : recipients) {
            List<Recipient> existingRecipients = recipientRepository.findByReferenceId(recipientUser.getId());

            if (existingRecipients == null || existingRecipients.isEmpty()) {
                Recipient rec = new Recipient();
                rec.setType("Maintenance_Task_Notification");
                rec.setName("Send Maintenance Task Notification");
                rec.setReferenceId(recipientUser.getId());
                existingRecipients.add(recipientService.createRecipient(rec));
            }

            Recipient existingRecipient = existingRecipients.get(0);

            Notification notification = new Notification();
            notification.setRecipient(existingRecipient);
            notification.setMessage(message);
            notification.setStatus(StatusNotifi.PENDING);
            notification.setCreatedAt(LocalDateTime.now());

            notificationRepository.save(notification);

            try {
                websocketService.sendNotificationToRecipients(recipientUser.getId(), notificationMaintenance);
            } catch (Exception e) {
                System.err.println("Error sending WebSocket notification for user ID: " + recipientUser.getId() + ", " + e.getMessage());
            }
        }

        ex.setTitle(notificationMaintenance.getTitle());
        ex.setDescription(notificationMaintenance.getDescription());
        ex.setStatus(notificationMaintenance.getStatus());
        ex.setMaintenanceDate(notificationMaintenance.getMaintenanceDate());
        ex.setMaintenanceTask(notificationMaintenance.getMaintenanceTask());

        return modelMapper.map(notificationMaintenanceRepository.save(ex), NotificationMaintenanceDto.class);
    }

    public NotificationMaintenanceDto getNotification(Long id) {
        NotificationMaintenance ex = notificationMaintenanceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Notification maintenance not found with ID: " + id));

        return modelMapper.map(notificationMaintenanceRepository.save(ex), NotificationMaintenanceDto.class);
    }

    public void deleteNotification(Long id) {
        NotificationMaintenance ex = notificationMaintenanceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Notification maintenance not found with ID: " + id));

        notificationMaintenanceRepository.delete(ex);
    }

    public NotificationMaintenanceDto updateStatus(Long id) {
        NotificationMaintenance ex = notificationMaintenanceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Notification maintenance not found with ID: " + id));

        ex.setStatus(StatusNotifi.READ);

        return modelMapper.map(notificationMaintenanceRepository.save(ex), NotificationMaintenanceDto.class);
    }
}
