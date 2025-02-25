package com.building_mannager_system.repository.system_manager;

import com.building_mannager_system.entity.property_manager.Device;
import com.building_mannager_system.entity.property_manager.DeviceDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceDetailRepository extends JpaRepository<DeviceDetail, Integer> {
    // Tìm `DeviceDetail` theo `deviceId`
    Optional<DeviceDetail> findByDevice_DeviceId(int deviceId);

    void deleteByDevice_DeviceId(Long deviceId);

    // Kiểm tra xem `DeviceDetail` có tồn tại cho thiết bị hay không
    boolean existsByDevice(Device device);
}
