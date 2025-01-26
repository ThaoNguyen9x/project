package com.building_mannager_system.dto.requestDto.customer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactDto {
    private Integer id;
    private Integer customerId;  // Using Customer ID instead of full Customer object
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String position;
}
