package com.building_mannager_system.dto.responseDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import com.building_mannager_system.entity.Role;

@Getter
@Setter
public class ResLoginDTO {
    @JsonProperty("access_token")
    private String accessToken;

    private UserInfo user;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private int id;

        private String name;

        private String email;

        private String mobile;

        private Role role;

        private boolean isOnline;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GetAccount {
        private UserInfo user;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsideToken {
        private int id;

        private String name;

        private String email;
    }
}
