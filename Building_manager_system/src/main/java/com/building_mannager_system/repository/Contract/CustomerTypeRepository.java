package com.building_mannager_system.repository.Contract;

import com.building_mannager_system.entity.customer_service.customer_manager.CustomerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerTypeRepository extends JpaRepository<CustomerType, Integer>,
        JpaSpecificationExecutor<CustomerType> {

    Boolean existsByTypeName(String typeName);

    Boolean existsByTypeNameAndIdNot(String typeName, int id);
}
