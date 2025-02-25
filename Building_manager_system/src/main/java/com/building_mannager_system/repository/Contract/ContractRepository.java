package com.building_mannager_system.repository.Contract;

import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer>,
        JpaSpecificationExecutor<Contract> {
    Contract findByCustomer(Customer customer);

    List<Contract> findByCustomerId(Integer customerId);

//    Contract findByOfficeID_Id(Integer officeId);

    List<Contract> findByEndDateBetween(LocalDate start, LocalDate end);
}
