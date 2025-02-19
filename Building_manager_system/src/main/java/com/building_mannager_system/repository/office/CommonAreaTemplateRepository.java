package com.building_mannager_system.repository.office;


import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.CommonAreaTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonAreaTemplateRepository extends JpaRepository<CommonAreaTemplate, Integer> {
}
