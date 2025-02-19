package com.building_mannager_system.entity.pament_entity;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "payment_contracts")
public class PaymentContract extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Tự động sinh giá trị cho PaymentId
    @Column(name = "PaymentId", nullable = false)
    private Integer paymentId;  // Mã định danh thanh toán

    @ManyToOne(fetch = FetchType.LAZY)  // Mối quan hệ Many-to-One với Contract
    @JoinColumn(name = "ContractId", referencedColumnName = "ContractId", nullable = false)
    private Contract contract;  // Liên kết với bảng Contract

    @Column(name = "PaymentAmount", nullable = false)
    private BigDecimal paymentAmount;  // Số tiền thanh toán

    @Column(name = "PaymentDate")
    private LocalDate paymentDate;  // Ngày thanh toán

    @Column(nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "PaymentStatus", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;  // Trạng thái thanh toán (Paid, Unpaid)

    private String sessionId; // Dùng cho stripe
}
