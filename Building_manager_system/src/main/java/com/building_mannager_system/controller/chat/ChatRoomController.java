package com.building_mannager_system.controller.chat;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.chat.ChatRoomDto;
import com.building_mannager_system.dto.responseDto.ResUserDTO;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.chat.ChatRoom;
import com.building_mannager_system.entity.property_manager.Device;
import com.building_mannager_system.service.Chat.ChatRoomService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat-rooms")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    public ChatRoomController(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }

    // Tạo phòng chat riêng giữa hai tài khoản
    @PostMapping("/private")
    @ApiMessage("Tạo phòng chat thành công")
    public ResponseEntity<ChatRoomDto> createUser(@RequestParam int account1Id, @RequestParam int account2Id) {
        return new ResponseEntity<>(chatRoomService.createPrivateChatRoom(account1Id, account2Id), HttpStatus.CREATED);
    }

    // Tạo phòng chat nhóm
    @PostMapping("/group")
    @ApiMessage("Tạo nhóm chat thành công")
    public ResponseEntity<ChatRoomDto> createGroupChatRoom(@RequestBody Map<String, List<Integer>> body) {
        List<Integer> accountIds = body.get("accountIds");
        return new ResponseEntity<>(chatRoomService.createGroupChatRoom(accountIds), HttpStatus.CREATED);
    }

//
//    @GetMapping("/{id}")
//    public ResponseEntity<List<ChatRoomDto>> getChatRoomByAccountId(@PathVariable("id") Long id) {
//        List<ChatRoomDto> chatRooms = chatRoomService.getAllRoomsByUserId(id);
//
//        if (chatRooms.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(Collections.emptyList());
//        }
//        return ResponseEntity.ok(chatRooms);
//    }
//
//    // Lấy tất cả phòng chat
//    @GetMapping
//    public List<ChatRoomDto> getAllChatRooms() {
//        return chatRoomService.getAllChatRooms();
//    }
//
//    // Xóa phòng chat theo ID
//    @DeleteMapping("/{id}")
//    public void deleteChatRoom(@PathVariable Long id) {
//        chatRoomService.deleteChatRoom(id);
//    }
}
