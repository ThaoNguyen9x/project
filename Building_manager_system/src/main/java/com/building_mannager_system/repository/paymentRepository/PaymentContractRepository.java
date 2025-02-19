package com.building_mannager_system.repository.paymentRepository;

import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentContractRepository extends JpaRepository<PaymentContract, Integer>,
        JpaSpecificationExecutor<PaymentContract> {

    Optional<PaymentContract> findBySessionId(String sessionId);

    @Query("SELECT p FROM PaymentContract p JOIN FETCH p.contract c JOIN FETCH c.customer cust JOIN FETCH cust.user WHERE p.dueDate = :date AND p.paymentStatus = :status")
    List<PaymentContract> findByDueDateAndPaymentStatus(@Param("date") LocalDate date, @Param("status") PaymentStatus status);
}
