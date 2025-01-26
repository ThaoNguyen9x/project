package com.building_mannager_system.repository.system_manager;

import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeterRepository extends JpaRepository<Meter, Integer>,
        JpaSpecificationExecutor<Meter> {
    // Lấy tất cả Meter theo officeId
    List<Meter> findByOfficeId(Integer officeId);

    Boolean existsBySerialNumber(String serialNumber);

    Boolean existsBySerialNumberNotAndId(String serialNumber, Integer id);
}
