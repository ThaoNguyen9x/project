package com.building_mannager_system.entity.verification;


import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.building_mannager_system.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "electricity_usage_verification")
@Getter
@Setter
@NoArgsConstructor

public class ElectricityUsageVerification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // ID tự động tăng

    @ManyToOne
    @JoinColumn(name = "meter_id", nullable = false)
    private Meter meter;  // Mối quan hệ với bảng Meter

    @Column(name = "start_reading", nullable = false)
    private BigDecimal startReading;  // Chỉ số điện đầu kỳ (tháng trước)

    @Column(name = "end_reading", nullable = false)
    private BigDecimal endReading;  // Chỉ số điện cuối kỳ (tháng hiện tại)

    @Column(name = "reading_date", nullable = false)
    private LocalDate readingDate;  // Ngày ghi chỉ số điện

    @Column(name = "image_name", nullable = false)
    private String imageName;  // Tên hình ảnh (hình ảnh của chỉ số điện của tháng hiện tại)

    @Column(name = "previous_month_image_name")
    private String previousMonthImageName;  // Tên hình ảnh của chỉ số điện tháng trước

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;  // Trạng thái xác nhận

    @Column(name = "previous_month_cost")
    private BigDecimal previousMonthCost;  // Số tiền của tháng trước

    @Column(name = "usage_amount_previous_month")
    private BigDecimal usageAmountPreviousMonth;  // Lượng điện sử dụng tháng trước

    @Column(name = "usage_amount_current_month")
    private BigDecimal usageAmountCurrentMonth;  // Lượng điện sử dụng tháng hiện tại

    @Column(name = "current_month_cost")
    private BigDecimal currentMonthCost;  // Số tiền của tháng hiện tại
}
