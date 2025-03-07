package com.building_mannager_system.dto.requestDto.ContractDto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ConfirmationRequestDto {
    private String status;
    private String comment;
}
