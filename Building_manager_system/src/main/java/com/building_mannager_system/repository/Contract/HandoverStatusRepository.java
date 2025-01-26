package com.building_mannager_system.repository.Contract;

import com.building_mannager_system.entity.customer_service.contact_manager.HandoverStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface HandoverStatusRepository extends JpaRepository<HandoverStatus, Integer>,
        JpaSpecificationExecutor<HandoverStatus> {
}
