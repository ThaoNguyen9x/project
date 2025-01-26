package com.building_mannager_system.dto.requestDto.verificationDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecipientDto {
    private Integer id;
    private String type;  // Loại recipient (ví dụ: "CONTACT", "OFFICE", "CUSTOMER")
    private Integer referenceId;
    private String name;
}
