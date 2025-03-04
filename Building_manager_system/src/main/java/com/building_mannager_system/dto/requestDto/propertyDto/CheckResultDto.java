package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckResultDto {
    private Long id;
    private CheckItemDto itemCheck;
    private String result;
    private UserDto technician;
    private String note;
    private LocalDateTime checkedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckItemDto {
        private int id;
        private String checkName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private int id;
        private String name;
    }
}