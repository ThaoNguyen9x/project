package com.building_mannager_system.repository.Contract;

import com.building_mannager_system.entity.customer_service.customer_manager.CustomerTypeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerTypeDocumentRepository extends JpaRepository<CustomerTypeDocument, Integer>,
        JpaSpecificationExecutor<CustomerTypeDocument> {

   List<CustomerTypeDocument> findByCustomerTypeIdAndStatus(Integer customerTypeId, boolean status);

   Boolean  existsByDocumentTypeAndCustomerType_Id(String documentType, Integer customerTypeId);

   Boolean existsByDocumentTypeAndCustomerType_IdAndIdNot(String documentType, Integer customerTypeId, Integer id);
}
