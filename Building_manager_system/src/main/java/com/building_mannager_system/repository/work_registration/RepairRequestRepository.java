package com.building_mannager_system.repository.work_registration;

import com.building_mannager_system.entity.work_registration.RepairRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, Long>,
        JpaSpecificationExecutor<RepairRequest> {
}
