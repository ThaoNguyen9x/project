package com.building_mannager_system.repository.notification;

import com.building_mannager_system.entity.notification.NotificationMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationMaintenanceRepository extends JpaRepository<NotificationMaintenance, Long>,
        JpaSpecificationExecutor<NotificationMaintenance> {
}
