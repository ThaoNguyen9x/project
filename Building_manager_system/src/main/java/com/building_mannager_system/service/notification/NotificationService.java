package com.building_mannager_system.service.notification;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.NotificationDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.notification.NotificationRepository;
import com.building_mannager_system.repository.notification.RecipientRepository;
import com.building_mannager_system.security.SecurityUtil;
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
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ModelMapper modelMapper;
    private final RecipientRepository recipientRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               ModelMapper modelMapper, RecipientRepository recipientRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.modelMapper = modelMapper;
        this.recipientRepository = recipientRepository;
        this.userRepository = userRepository;
    }

    public ResultPaginationDTO getAllNotifications(Specification<Notification> spec,
                                                   Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().orElse("");

        User user = userRepository.findByEmail(email);
        if (user == null) throw new APIException(HttpStatus.NOT_FOUND, "User not found");

        spec = Specification.where((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("recipient").get("referenceId"), user.getId()));

        Page<Notification> page = notificationRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);

        List<NotificationDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, NotificationDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public NotificationDto createNotification(Notification notification) {
        // Check recipient
        if (notification.getRecipient() != null) {
            Recipient recipient = recipientRepository.findById(notification.getRecipient().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Recipient not found with ID: " + notification.getRecipient().getId()));
            notification.setRecipient(recipient);
        }

        return modelMapper.map(notificationRepository.save(notification), NotificationDto.class);
    }

    public NotificationDto getNotification(int id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Notification not found with ID: " + id));

        return modelMapper.map(notificationRepository.save(notification), NotificationDto.class);
    }

    public NotificationDto updateNotification(Integer id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    // Cập nhật trạng thái và thời gian gửi
                    notification.setStatus(StatusNotifi.SENT);
                    notification.setSentAt(LocalDateTime.now());

                    // Lưu lại thông báo
                    Notification updatedNotification = notificationRepository.save(notification);

                    // Chuyển đổi sang DTO
                    return modelMapper.map(updatedNotification, NotificationDto.class);
                })
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Notification not found with ID: " + id));
    }

    public NotificationDto readNotification(Integer id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    // Cập nhật trạng thái và thời gian gửi
                    notification.setStatus(StatusNotifi.READ);
                    notification.setSentAt(LocalDateTime.now());

                    // Lưu lại thông báo
                    Notification updatedNotification = notificationRepository.save(notification);

                    // Chuyển đổi sang DTO
                    return modelMapper.map(updatedNotification, NotificationDto.class);
                })
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Notification not found with ID: " + id));
    }

    public void deleteNotification(int id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Recipient not found with ID: " + id));

        notificationRepository.delete(notification);
    }

//    public List<NotificationDto> getNotificationsForRecipient(Integer recipientId) {
//        // Retrieve notifications from repository
//        List<Notification> notifications = notificationRepository.findByRecipient_IdAndStatus(recipientId, StatusNotifi.SENT);
//
//        // Convert to DTOs using MapStruct
//        List<NotificationDto> notificationDTOs = notifications.stream()
//                .map(notificationMapper::toNotificationDTO)
//                .collect(Collectors.toList());
//        System.out.println("Number of notifications found: " + notifications.size());
//        return notificationDTOs;
//    }
}
