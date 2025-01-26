package com.building_mannager_system.dto.requestDto.chat;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatRoomGroupDto {
    private Long chatRoomId;
    private String chatRoomName;
    private Boolean isPrivate;
    private List<ChatRoomUserDto.User> users;
}

