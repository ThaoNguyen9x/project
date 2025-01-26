package com.building_mannager_system.repository.system_manager;

import com.building_mannager_system.entity.property_manager.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long>,
        JpaSpecificationExecutor<Quotation> {
}
