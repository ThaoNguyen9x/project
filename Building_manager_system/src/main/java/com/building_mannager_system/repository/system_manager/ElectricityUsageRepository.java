package com.building_mannager_system.repository.system_manager;

import com.building_mannager_system.entity.customer_service.system_manger.ElectricityUsage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ElectricityUsageRepository extends JpaRepository<ElectricityUsage, Integer>,
        JpaSpecificationExecutor<ElectricityUsage> {

    // Phương thức tự động tìm kiếm các bản ghi ElectricityUsage theo meterId
    Page<ElectricityUsage> findByMeterId(Integer meterId, Pageable pageable);

    // Phương thức tìm kiếm dữ liệu sử dụng điện trong khoảng thời gian
    List<ElectricityUsage> findByMeterIdAndReadingDateBetween(Integer meterId, LocalDate startDate, LocalDate endDate);
}
