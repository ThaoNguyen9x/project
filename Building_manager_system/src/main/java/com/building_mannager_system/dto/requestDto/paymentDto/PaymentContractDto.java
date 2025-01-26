package com.building_mannager_system.dto.requestDto.paymentDto;

import com.building_mannager_system.dto.requestDto.ContractDto.ContractDto;
import com.building_mannager_system.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentContractDto {
    private Integer paymentId;  // Mã thanh toán
    private ContractDto contract;  // ID hợp đồng
    private BigDecimal paymentAmount;  // Số tiền thanh toán
    private LocalDate paymentDate;  // Ngày thanh toán
    private PaymentStatus paymentStatus;  // Trạng thái thanh toán (Paid, Unpaid)

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
