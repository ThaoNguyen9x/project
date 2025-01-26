package com.building_mannager_system.service.notification;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.NotificationDto;
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
import com.building_mannager_system.service.websocket.WebsocketService;
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
public class NotificationMaintenanceService {

    private final NotificationMaintenanceRepository notificationMaintenanceRepository;
    private final WebsocketService websocketService;
    private final ModelMapper modelMapper;
    private final MaintenanceTaskRepository maintenanceTaskRepository;
    private final UserRepository userRepository;
    private final RecipientService recipientService;

    public NotificationMaintenanceService(NotificationMaintenanceRepository notificationMaintenanceRepository,
                                          WebsocketService websocketService,
                                          ModelMapper modelMapper, MaintenanceTaskRepository maintenanceTaskRepository, UserRepository userRepository, RecipientService recipientService) {
        this.notificationMaintenanceRepository = notificationMaintenanceRepository;
        this.websocketService = websocketService;
        this.modelMapper = modelMapper;
        this.maintenanceTaskRepository = maintenanceTaskRepository;
        this.userRepository = userRepository;
        this.recipientService = recipientService;
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

        List<String> roles = List.of("TECHNICAL_MANAGER", "ENGINEERING");

        List<User> recipients = userRepository.findByRole_NameIn(roles);

        if (recipients.isEmpty())
            throw new APIException(HttpStatus.NOT_FOUND, "No recipients found for the roles TECHNICAL_MANAGER and ENGINEERING.");

        for (User recipientUser : recipients) {
            Recipient rec = new Recipient();
            rec.setType("Technical");
            rec.setName("Notification Maintenance");
            rec.setReferenceId(recipientUser.getId()); // Reference ID for the recipient

            Recipient recipient = recipientService.createRecipient(rec);

            websocketService.sendNotificationToRecipients(recipientUser.getId(), notificationMaintenance);
        }

        return modelMapper.map(notificationMaintenanceRepository.save(notificationMaintenance), NotificationMaintenanceDto.class);
    }

    public NotificationMaintenanceDto updateNotification(Long id, NotificationMaintenance notificationMaintenance) {
        NotificationMaintenance ex = notificationMaintenanceRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Notification maintenance not found with ID: " + id));

        // Check MaintenanceTask
        if (notificationMaintenance.getMaintenanceTask() != null) {
            MaintenanceTask maintenanceTask = maintenanceTaskRepository.findById(notificationMaintenance.getMaintenanceTask().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance task not found with ID: " + notificationMaintenance.getMaintenanceTask().getId()));
            notificationMaintenance.setMaintenanceTask(maintenanceTask);
        }

        List<String> roles = List.of("TECHNICAL_MANAGER", "ENGINEERING");

        List<User> recipients = userRepository.findByRole_NameIn(roles);

        if (recipients.isEmpty())
            throw new APIException(HttpStatus.NOT_FOUND, "No recipients found for the roles TECHNICAL_MANAGER and ENGINEERING.");

        for (User recipientUser : recipients) {
            Recipient rec = new Recipient();
            rec.setType("Technical");
            rec.setName("Notification Maintenance");
            rec.setReferenceId(recipientUser.getId()); // Reference ID for the recipient

            Recipient recipient = recipientService.createRecipient(rec);

            websocketService.sendNotificationToRecipients(recipientUser.getId(), notificationMaintenance);
        }

        ex.setTitle(notificationMaintenance.getTitle());
        ex.setDescription(notificationMaintenance.getDescription());
        ex.setRecipient(notificationMaintenance.getRecipient());
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
