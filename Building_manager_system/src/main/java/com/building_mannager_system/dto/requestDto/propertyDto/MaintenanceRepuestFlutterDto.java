package com.building_mannager_system.dto.requestDto.propertyDto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class MaintenanceRepuestFlutterDto {
    private Long id; // Optional ID for updates

    @NotNull(message = "maintenanceId không được null")
    private Long maintenanceServiceId;


    @Size(max = 500, message = "notes không được vượt quá 500 ký tự")
    private String notes;



    private Integer technicianId;

    @Size(max = 500, message = "findings không được vượt quá 500 ký tự")
    private String findings;

    @Size(max = 500, message = "resolution không được vượt quá 500 ký tự")
    private String resolution;
}
