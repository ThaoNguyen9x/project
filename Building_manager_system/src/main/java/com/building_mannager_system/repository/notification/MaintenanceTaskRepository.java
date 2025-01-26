package com.building_mannager_system.repository.notification;

import com.building_mannager_system.entity.property_manager.MaintenanceTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, Long>,
        JpaSpecificationExecutor<MaintenanceTask> {
}
