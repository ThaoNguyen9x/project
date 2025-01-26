package com.building_mannager_system.repository;

import com.building_mannager_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer>,
        JpaSpecificationExecutor<User> {

    Boolean existsByEmail(String email);

    Boolean existsByEmailAndIdNot(String email, int id);

    User findByEmail(String email);

    User findByRefreshTokenAndEmail(String refreshToken, String email);

    List<User> findByRole_NameIn(List<String> roles);
}
