package com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommonAreaDto {
    private Long id;
    private LocationDto location;
    private String name;
    private String color;
    private double startX;
    private double startY;
    private double endX;
    private double endY;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDto {
        private int id;
        private String floor;
    }
}
