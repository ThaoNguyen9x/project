package com.building_mannager_system.dto.responseDto.property;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MeterResponseDto {
    private int id;
    private String serialNumber;
    private String meterType;
    private LocalDate installationDate;
    private String officeName;
    private String locationFloor;

    public MeterResponseDto( int id,String serialNumber, String meterType, LocalDate installationDate, String officeName, String locationFloor) {
        this.id = id;
        this.serialNumber = serialNumber;
        this.meterType = meterType;
        this.installationDate = installationDate;
        this.officeName = officeName;
        this.locationFloor = locationFloor;
    }
}
