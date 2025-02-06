package com.building_mannager_system.repository.paymentRepository;

import com.building_mannager_system.entity.pament_entity.PaymentContract;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentContractRepository extends JpaRepository<PaymentContract, Integer>,
        JpaSpecificationExecutor<PaymentContract> {

    Optional<PaymentContract> findBySessionId(String sessionId);
}
