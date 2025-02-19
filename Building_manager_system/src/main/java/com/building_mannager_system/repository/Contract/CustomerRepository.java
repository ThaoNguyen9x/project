package com.building_mannager_system.repository.Contract;

import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer>,
        JpaSpecificationExecutor<Customer> {

    @Query("SELECT c FROM Customer c WHERE FUNCTION('DATE_FORMAT', c.birthday, '%m-%d') BETWEEN :today AND :nextThreeDays AND c.status = 'ACTIV'")
    List<Customer> findCustomersWithBirthdayInRange(@Param("today") String today, @Param("nextThreeDays") String nextThreeDays);
}
