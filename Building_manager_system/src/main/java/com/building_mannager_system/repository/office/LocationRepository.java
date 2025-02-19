package com.building_mannager_system.repository.office;

import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location ,Integer>,
        JpaSpecificationExecutor<Location> {

    Boolean existsByFloor(String floor);

    Boolean existsByFloorAndIdNot(String floor, int id);
}
