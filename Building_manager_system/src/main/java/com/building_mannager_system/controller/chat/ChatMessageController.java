package com.building_mannager_system.controller.chat;


import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.chat.ChatMessageDto;
import com.building_mannager_system.dto.responseDto.ApiResponce;
import com.building_mannager_system.entity.Role;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.chat.ChatMessage;
import com.building_mannager_system.entity.chat.ChatRoomUser;
import com.building_mannager_system.enums.MessageStatus;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.chat.ChatMessageRepository;
import com.building_mannager_system.repository.chat.ChatRoomUserRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.Chat.ChatMessageService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat-messages")
public class ChatMessageController {
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final UserRepository userRepository;

    public ChatMessageController(ChatMessageService chatMessageService,
                                 SimpMessagingTemplate messagingTemplate,
                                 ChatRoomUserRepository chatRoomUserRepository,
                                 UserRepository userRepository) {
        this.chatMessageService = chatMessageService;
        this.messagingTemplate = messagingTemplate;
        this.chatRoomUserRepository = chatRoomUserRepository;
        this.userRepository = userRepository;
    }

    //    // Gửi tin nhắn qua RESTful API
//    @PostMapping
//    public ChatMessageDto sendMessage(@RequestBody ChatMessageDto chatMessageDto) {
//        ChatMessageDto savedMessage = chatMessageService.sendMessage(chatMessageDto);
//        messagingTemplate.convertAndSend("/topic/messages/" + chatMessageDto.getRoomId(), savedMessage);
//        return savedMessage;
//    }
//
    // Gửi tin nhắn qua WebSocket
    // ✅ Xử lý gửi tin nhắn từ WebSocket
    @PostMapping("/sendMessage")
    @ApiMessage("Gửi tin nhắn thành công")
    public ResponseEntity<ChatMessageDto> sendMessage(@RequestBody ChatMessage chatMessage) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User sender = userRepository.findByEmail(email);

        List<ChatRoomUser> chatRoomUsers = chatRoomUserRepository.findByChatRoom_Id(chatMessage.getChatRoom().getId());

        for (ChatRoomUser user : chatRoomUsers) {
            if (!user.getUser().getId().equals(sender.getId())) {
                if (Boolean.TRUE.equals(user.getUser().getIsOnline())) {
                    chatMessage.setStatus(MessageStatus.RECEIVED);

                    messagingTemplate.convertAndSend(
                            "/topic/messages/" + user.getUser().getId(),
                            chatMessageService.sendMessage(chatMessage)
                    );
                }
            }
        }

        messagingTemplate.convertAndSend(
                "/topic/messages/room/" + chatMessage.getChatRoom().getId(),
                chatMessageService.sendMessage(chatMessage)
        );

        return new ResponseEntity<>(chatMessageService.sendMessage(chatMessage), HttpStatus.CREATED);
    }

    @GetMapping("/room/{roomId}")
    @ApiMessage("Lấy danh sách tin nhắn theo room thành công")
    public ResponseEntity<ResultPaginationDTO> getMessagesByRoomId(@PathVariable(name = "roomId") Long roomId,
                                                                   @Filter Specification<ChatMessage> spec,
                                                                   Pageable pageable) {
        return ResponseEntity.ok(chatMessageService.getAllMessagesByRoomId(roomId, spec, pageable));
    }

    @DeleteMapping("/chat-history/{roomId}")
    @ApiMessage("Xóa lịch sử trò chuyện thành công")
    public ResponseEntity<Void> deleteChatHistory(@PathVariable(name = "roomId") Long roomId) {
        chatMessageService.deleteChatHistory(roomId);
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User sender = userRepository.findByEmail(email);

        List<ChatRoomUser> chatRoomUsers = chatRoomUserRepository.findByChatRoom_Id(roomId);

        for (ChatRoomUser user : chatRoomUsers) {
            if (!user.getUser().getId().equals(sender.getId())) {
                if (Boolean.TRUE.equals(user.getUser().getIsOnline())) {
                    messagingTemplate.convertAndSend(
                            "/topic/messages/room/" + roomId,"{\"action\": \"DELETE\"}"
                    );
                }
            }
        }
        return ResponseEntity.ok(null);
    }

    @PutMapping("/change-status/{roomId}")
    @ApiMessage("Đổi sang trạng thái READ thành công")
    public ResponseEntity<ChatMessageDto> changeStatus(@PathVariable(name = "roomId") Long roomId) {
        List<ChatMessageDto> updatedMessages = chatMessageService.changeStatus(roomId);

        ChatMessageDto mostRecentMessage = updatedMessages.isEmpty() ? null : updatedMessages.get(updatedMessages.size() - 1);

        if (mostRecentMessage != null) {
            messagingTemplate.convertAndSend(
                    "/topic/messages/room/" + roomId,
                    mostRecentMessage
            );
        }

        return ResponseEntity.ok(mostRecentMessage);
    }


//
//    // Xóa tin nhắn theo ID
//    @DeleteMapping("/{id}")
//    public void deleteMessage(@PathVariable Long id) {
//        chatMessageService.deleteMessage(id);
//    }
}
