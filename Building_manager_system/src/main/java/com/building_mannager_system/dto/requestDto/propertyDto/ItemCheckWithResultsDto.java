package com.building_mannager_system.dto.requestDto.propertyDto;

import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ItemCheckWithResultsDto {
    private Long id;
    private ItemCheckDto itemCheck;
    private String result;
    private CustomerDto.User technician;
    private String note;
    private LocalDateTime checkedAt;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}