package com.building_mannager_system.dto.requestDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqChangePasswordDTO {
    private String email;

    private String oldPassword;

    private String newPassword;
}
