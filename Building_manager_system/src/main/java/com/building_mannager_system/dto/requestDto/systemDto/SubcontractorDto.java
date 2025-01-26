package com.building_mannager_system.dto.requestDto.systemDto;

import com.building_mannager_system.enums.ServiceType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubcontractorDto {
    private Integer id;
    private String name;
    private String phone;
    private ServiceType serviceType;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private BigDecimal rating;
    private SystemDto system; // Reference to the System entity
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
