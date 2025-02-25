package com.building_mannager_system.repository.system_manager;

import com.building_mannager_system.entity.property_manager.ItemCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCheckRepository extends JpaRepository<ItemCheck, Long>,
        JpaSpecificationExecutor<ItemCheck> {
    Page<ItemCheck> findAllByDevice_DeviceId(Long deviceId, Pageable pageable);
}
