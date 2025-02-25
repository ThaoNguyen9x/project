package com.building_mannager_system.repository.system_manager;

import com.building_mannager_system.entity.property_manager.ItemCheckResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckResultRepository extends JpaRepository<ItemCheckResult, Long>,
        JpaSpecificationExecutor<ItemCheckResult> {
    Page<ItemCheckResult> findByItemCheckId(Long checkItemId, Pageable pageable);

    void deleteByItemCheckId(Long checkItemId);
    boolean existsByItemCheckId(Long checkItemId);
}
