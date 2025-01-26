package com.building_mannager_system.repository.notification;

import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.enums.StatusNotifi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer>,
        JpaSpecificationExecutor<Notification> {
    // Tìm thông báo chưa gửi (PENDING) theo Recipient ID
    List<Notification> findByRecipient_IdAndStatus(Integer reInteger, StatusNotifi  statusNotifi);

    // Tìm tất cả thông báo của một Recipient
    List<Notification> findByRecipient_Id(Integer recipientId);
}
