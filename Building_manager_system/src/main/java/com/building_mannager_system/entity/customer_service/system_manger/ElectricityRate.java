package com.building_mannager_system.entity.customer_service.system_manger;

import com.building_mannager_system.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "electricity_rate")
public class ElectricityRate extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // ID tự động tăng

    @Column(name = "tier_name", nullable = false)
    private String tierName;  // Tên bậc giá

    @Column(name = "min_usage", nullable = false)
    private Integer minUsage;  // Mức tiêu thụ tối thiểu (kWh)

    @Column(name = "max_usage")
    private Integer maxUsage;  // Mức tiêu thụ tối đa (kWh)

    @Column(name = "rate", nullable = false)
    private Double rate;  // Giá điện (VNĐ/kWh)
}
