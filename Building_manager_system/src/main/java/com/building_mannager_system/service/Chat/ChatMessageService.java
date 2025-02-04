package com.building_mannager_system.service.Chat;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.chat.ChatMessageDto;
import com.building_mannager_system.entity.Role;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.chat.ChatMessage;
import com.building_mannager_system.entity.chat.ChatRoom;
import com.building_mannager_system.enums.MessageStatus;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.chat.ChatMessageRepository;
import com.building_mannager_system.repository.chat.ChatRoomRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ModelMapper modelMapper;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository,
                              ModelMapper modelMapper,
                              ChatRoomRepository chatRoomRepository,
                              UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.modelMapper = modelMapper;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
    }

    public ResultPaginationDTO getAllMessages(Specification<ChatMessage> spec,
                                                 Pageable pageable) {

        Page<ChatMessage> page = chatMessageRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<ChatMessageDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ChatMessageDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public ResultPaginationDTO getAllMessagesByRoomId(Long roomId, Specification<ChatMessage> spec,
                                              Pageable pageable) {

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Room not found with ID: " + roomId));

        Specification<ChatMessage> finalSpec = spec.and((root, query, builder) ->
                builder.equal(root.get("chatRoom").get("id"), roomId));

        Page<ChatMessage> page = chatMessageRepository.findAll(finalSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<ChatMessageDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ChatMessageDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public ChatMessageDto sendMessage(ChatMessage chatMessage) {
        if (chatMessage.getChatRoom() != null) {
            ChatRoom chatRoom = chatRoomRepository.findById(chatMessage.getChatRoom().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Chat room not found with ID: " + chatMessage.getChatRoom().getId()));
            chatMessage.setChatRoom(chatRoom);
        }

        if (chatMessage.getUser() != null) {
            User user = userRepository.findById(chatMessage.getUser().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + chatMessage.getUser().getId()));
            chatMessage.setUser(user);
        }

        return modelMapper.map(chatMessageRepository.save(chatMessage), ChatMessageDto.class);
    }

    public void deleteMessage(Long id) {
        ChatMessage ex = chatMessageRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Message not found with ID: " + id));
        chatMessageRepository.delete(ex);
    }

    public void deleteChatHistory(Long roomId) {
        List<ChatMessage> chatMessages = chatMessageRepository.findByChatRoomId(roomId);
        chatMessageRepository.deleteAll(chatMessages);
    }

    public List<ChatMessageDto> changeStatus(Long roomId) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        List<ChatMessage> unreadMessages = chatMessageRepository
                .findByChatRoomIdAndStatusNotAndCreatedByNot(roomId, MessageStatus.READ, user.getEmail());

        unreadMessages.forEach(message -> message.setStatus(MessageStatus.READ));

        chatMessageRepository.saveAll(unreadMessages);

        return unreadMessages.stream()
                .map(message -> modelMapper.map(message, ChatMessageDto.class))
                .collect(Collectors.toList());
    }
}
