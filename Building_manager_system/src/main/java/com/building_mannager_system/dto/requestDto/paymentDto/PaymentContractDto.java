package com.building_mannager_system.dto.requestDto.paymentDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDto;
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
    private LocalDate dueDate; // Hạn cuối thanh toán
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
        private LocalDate startDate;
        private LocalDate endDate;
        private String leaseStatus;
        private CustomerDto customer;
        private BigDecimal totalAmount;
        private String fileName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDto {
        private Integer id;
        private String companyName;
        private String email;
        private String phone;
        private String address;
        private String status;
        private String directorName;
        private LocalDate birthday;
        private User user;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private Integer id;
        private String name;
        private String email;
        private String mobile;
        private Role role;
        private boolean status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Role {
        private Integer id;
        private String name;
        private boolean status;
    }
}
