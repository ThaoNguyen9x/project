package com.building_mannager_system.dto.requestDto.ContractDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ContractDto {
    private Integer id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String leaseStatus;
    private OfficesDto office;
    private CustomerDto customer;
    private BigDecimal totalAmount;
    private String fileName;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
