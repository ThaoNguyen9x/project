package com.building_mannager_system.repository;

import com.building_mannager_system.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer>,
        JpaSpecificationExecutor<PasswordResetToken> {

    Optional<PasswordResetToken> findByToken(String token);
}
