package com.building_mannager_system.controller.chat;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.chat.ChatRoomUserDto;
import com.building_mannager_system.entity.chat.ChatRoomUser;
import com.building_mannager_system.entity.property_manager.Device;
import com.building_mannager_system.service.Chat.ChatRoomUserService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/chat-room-users")
public class ChatRoomUserController {
    private final ChatRoomUserService chatRoomUserService;

    public ChatRoomUserController(ChatRoomUserService chatRoomUserService) {
        this.chatRoomUserService = chatRoomUserService;
    }

    //    @GetMapping("/room/{roomId}")
//    public List<ChatRoomUserDto> getUsersByChatRoom(@PathVariable Long roomId) {
//        return chatRoomUserService.(roomId);
//    }

    @GetMapping
    @ApiMessage("Lấy danh sách phòng chat thành công")
    public ResponseEntity<ResultPaginationDTO> getAllChatRoomUsersByUser(@Filter Specification<ChatRoomUser> spec,
                                                             Pageable pageable) {
        return ResponseEntity.ok(chatRoomUserService.getAllChatRoomUsersByUser(spec, pageable));
    }

    @GetMapping("/group")
    @ApiMessage("Lấy danh sách nhóm chat thành công")
    public ResponseEntity<ResultPaginationDTO> getAllChatRoomGroupsByUser(@Filter Specification<ChatRoomUser> spec,
                                                                         Pageable pageable) {
        return ResponseEntity.ok(chatRoomUserService.getAllChatRoomGroupsByUser(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Thêm người dùng vào phòng chat thành công")
    public ResponseEntity<ChatRoomUserDto> addUserToChatRoom(@RequestBody ChatRoomUser chatRoomUser) {
        return new ResponseEntity<>(chatRoomUserService.addUserToChatRoom(chatRoomUser), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa người dùng từ phòng chat thành công")
    public ResponseEntity<Void> removeUserFromChatRoom(@PathVariable(name = "id") Long id) {
        chatRoomUserService.removeUserFromChatRoom(id);
        return ResponseEntity.ok(null);
    }
}
