package com.building_mannager_system.repository.system_manager;

import com.building_mannager_system.entity.property_manager.Subcontractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SubcontractorsRepository extends JpaRepository<Subcontractor, Integer>,
        JpaSpecificationExecutor<Subcontractor> {
}
