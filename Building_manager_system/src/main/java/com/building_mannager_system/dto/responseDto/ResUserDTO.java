package com.building_mannager_system.dto.responseDto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResUserDTO {
    private int id;

    private String name;

    private String email;

    private String mobile;

    private String refreshToken;

    private boolean status;

    private Boolean isOnline;

    private LocalDateTime createdAt;

    private String createdBy;

    private LocalDateTime updatedAt;

    private String updatedBy;

    private Role role;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Role {
        private int id;
        private String name;
        private boolean status;
    }
}
