package com.building_mannager_system.repository.office;

import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.CommonArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommonAreaRepository extends JpaRepository<CommonArea, Integer>,
        JpaSpecificationExecutor<CommonArea> {

    List<CommonArea> findByLocation_Id(int id);
}
