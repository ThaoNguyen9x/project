package com.building_mannager_system.repository.Contract;

import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer>,
        JpaSpecificationExecutor<Contract> {
    Contract findByCustomer(Customer customer);

//    Contract findByOfficeID_Id(Integer officeId);
}
