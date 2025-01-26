package com.building_mannager_system.service.Chat;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.chat.ChatRoomDto;
import com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.chat.ChatRoom;
import com.building_mannager_system.entity.chat.ChatRoomUser;
import com.building_mannager_system.entity.property_manager.Device;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.chat.ChatRoomRepository;
import com.building_mannager_system.repository.chat.ChatRoomUserRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository,
                           ChatRoomUserRepository chatRoomUserRepository,
                           ModelMapper modelMapper, UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatRoomUserRepository = chatRoomUserRepository;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    public ChatRoomDto createPrivateChatRoom(int accountId1, int accountId2) {
        Optional<User> account1 = userRepository.findById(accountId1);
        Optional<User> account2 = userRepository.findById(accountId2);

        if (account1.isEmpty()) throw new APIException(HttpStatus.NOT_FOUND, "Tài khoản với ID " + accountId1 + " không tồn tại");
        if (account2.isEmpty()) throw new APIException(HttpStatus.NOT_FOUND, "Tài khoản với ID " + accountId2 + " không tồn tại");

        List<ChatRoom> existingRooms = chatRoomRepository.findPrivateRoomByUserPair(accountId1, accountId2);

        if (!existingRooms.isEmpty()) throw new APIException(HttpStatus.BAD_REQUEST, "Bạn và người này đã có phòng chat chung");

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(account1.get().getName() + " & " + account2.get().getName());
        chatRoom.setDescription(account1.get().getName() + " & " + account2.get().getName());
        chatRoom.setIsPrivate(true);

        ChatRoom savedRoom = chatRoomRepository.save(chatRoom);

        List<ChatRoomUser> chatRoomUsers = Arrays.asList(
                new ChatRoomUser(null, savedRoom, account1.get(), LocalDateTime.now()),
                new ChatRoomUser(null, savedRoom, account2.get(), LocalDateTime.now())
        );
        chatRoomUserRepository.saveAll(chatRoomUsers);

        return modelMapper.map(savedRoom, ChatRoomDto.class);
    }

    /**
     * ✅ Tìm tất cả phòng chat của một người dùng
     */
//    public List<ChatRoomDto> getAllRoomsByUserId(Long userId) {
//        List<ChatRoom> rooms = chatRoomRepository.findByUsers_User_Id(userId);
//        return modelMapper.map(rooms, ChatRoomDto.class);
//    }

    public ChatRoomDto createGroupChatRoom(List<Integer> accountIds) {
        List<User> users = userRepository.findAllById(accountIds);

        if (users.size() != accountIds.size()) {
            List<Integer> missingIds = new ArrayList<>(accountIds);
            missingIds.removeAll(users.stream().map(User::getId).collect(Collectors.toList()));
            throw new APIException(HttpStatus.NOT_FOUND, "Các tài khoản sau không tồn tại: " + missingIds);
        }

        long count = users.size();

        List<ChatRoom> existingRooms = chatRoomRepository.findGroupChatByUsers(accountIds, count);
        if (!existingRooms.isEmpty()) throw new APIException(HttpStatus.BAD_REQUEST, "Nhóm chat này đã tồn tại");

        String roomDescription = users.stream()
                .map(User::getName)
                .collect(Collectors.joining(" & "));

        Random random = new Random();
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName("Nhóm " + random.nextInt(100));
        chatRoom.setDescription(roomDescription);
        chatRoom.setIsPrivate(false);

        ChatRoom savedRoom = chatRoomRepository.save(chatRoom);

        List<ChatRoomUser> chatRoomUsers = new ArrayList<>();
        for (User user : users) {
            chatRoomUsers.add(new ChatRoomUser(null, savedRoom, user, LocalDateTime.now()));
        }

        chatRoomUserRepository.saveAll(chatRoomUsers);

        return modelMapper.map(savedRoom, ChatRoomDto.class);
    }

//    public ChatRoomDto createGroupChatRoom(ChatRoom chatRoom) {
//        return modelMapper.map(chatRoomRepository.save(chatRoom), ChatRoomDto.class);
//    }

    public ResultPaginationDTO getAllChatRooms(Specification<ChatRoom> spec,
                                                 Pageable pageable) {

        Page<ChatRoom> page = chatRoomRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<ChatRoomDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ChatRoomDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public void deleteChatRoom(Long id) {
        ChatRoom ex = chatRoomRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Chat room not found with ID: " + id));
        chatRoomRepository.delete(ex);
    }
}
