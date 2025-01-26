package com.building_mannager_system.repository.notification;

import com.building_mannager_system.entity.notification.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipientRepository extends JpaRepository<Recipient, Integer>,
        JpaSpecificationExecutor<Recipient> {
    List<Recipient> findByReferenceId(Integer referenceId);

}
