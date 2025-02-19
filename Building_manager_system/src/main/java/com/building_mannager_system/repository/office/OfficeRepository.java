package com.building_mannager_system.repository.office;

import com.building_mannager_system.entity.customer_service.contact_manager.Office;

import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfficeRepository extends JpaRepository<Office, Integer>,
        JpaSpecificationExecutor<Office> {

//    List<Office> findByLocation(Location location);
}
