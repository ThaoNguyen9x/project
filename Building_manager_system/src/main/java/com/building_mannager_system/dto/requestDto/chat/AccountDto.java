package com.building_mannager_system.dto.requestDto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountDto {
    private Long id;          // ID người dùng
    private String username;  // Tên người dùng
    private String email;     // Email của người dùng
    private String avatar;
    private  Boolean isOnline;// URL của ảnh đại diện
    private Boolean isOnlineWebsocket;
}
