package com.building_mannager_system.repository.work_registration;

import com.building_mannager_system.entity.work_registration.WorkRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkRegistrationRepository extends JpaRepository<WorkRegistration, Integer>,
        JpaSpecificationExecutor<WorkRegistration> {
}
