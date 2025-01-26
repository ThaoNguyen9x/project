package com.building_mannager_system.entity.customer_service.system_manger;

import com.building_mannager_system.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "ElectricityUsage")
public class ElectricityUsage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UsageID", nullable = false)
    private Integer id;  // Mã định danh cho mỗi bản ghi sử dụng điện

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meter_id", nullable = false)
    private Meter meter;  // Liên kết với đồng hồ (Meter) mà sử dụng điện

    @Column(name = "StartReading", precision = 15, scale = 2, nullable = false)
    private BigDecimal startReading;  // Chỉ số điện đầu kỳ (kWh)

    @Column(name = "EndReading", precision = 15, scale = 2, nullable = false)
    private BigDecimal endReading;  // Chỉ số điện cuối kỳ (kWh)

    @Column(name = "UsageAmount", precision = 15, scale = 2, nullable = false)
    private BigDecimal usageAmount;  // Lượng điện sử dụng (kWh)

    @Column(name = "ElectricityRate", precision = 15, scale = 2, nullable = false)
    private BigDecimal electricityRate;  // Giá điện theo kWh

    @Column(name = "ElectricityCost", precision = 15, scale = 2, nullable = false)
    private BigDecimal electricityCost;  // Tổng chi phí điện

    @Column(name = "readingDate", nullable = false)
    private LocalDate readingDate;  // Ngày ghi (thay vì billingPeriod)

    @Column(name = "ImageName")
    private String imageName;  // Tên hoặc đường dẫn đến hình ảnh liên quan (tùy chọn)

    @Column(name = "Comments")
    private String comments;  // Ghi chú về việc sử dụng điện (tùy chọn)
}

