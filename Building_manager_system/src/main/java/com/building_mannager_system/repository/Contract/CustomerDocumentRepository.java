package com.building_mannager_system.repository.Contract;

import com.building_mannager_system.entity.customer_service.customer_manager.CustomerDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerDocumentRepository extends JpaRepository<CustomerDocument, Integer>,
        JpaSpecificationExecutor<CustomerDocument> {

    List<CustomerDocument> findByCustomerId(int customerId);
}
