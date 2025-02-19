package com.building_mannager_system.dto.requestDto;

import com.building_mannager_system.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckPaymentNotificationDto {
    private Integer paymentId;  // Mã thanh toán

    private ContractDto contract;  // ID hợp đồng
    private BigDecimal paymentAmount;  // Số tiền thanh toán
    private LocalDate paymentDate;  // Ngày thanh toán
    private LocalDateTime dueDate;
    private PaymentStatus paymentStatus;  // Trạng thái thanh toán (Paid, Unpaid)

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContractDto {
        private Integer id;
        private CustomerDto customer;
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDto {
        private Integer id;
    }
}
