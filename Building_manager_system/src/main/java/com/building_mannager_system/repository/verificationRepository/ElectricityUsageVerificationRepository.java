package com.building_mannager_system.repository.verificationRepository;

import com.building_mannager_system.entity.verification.ElectricityUsageVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ElectricityUsageVerificationRepository extends JpaRepository<ElectricityUsageVerification, Integer>,
        JpaSpecificationExecutor<ElectricityUsageVerification> {
    Optional<ElectricityUsageVerification> findByMeterIdAndReadingDate(Integer meterId, LocalDate readingDate);
}
