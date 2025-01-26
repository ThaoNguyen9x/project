package com.building_mannager_system.service.Chat;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.chat.ChatRoomGroupDto;
import com.building_mannager_system.dto.requestDto.chat.ChatRoomUserDto;
import com.building_mannager_system.dto.requestDto.propertyDto.DeviceDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.chat.ChatMessage;
import com.building_mannager_system.entity.chat.ChatRoomUser;
import com.building_mannager_system.entity.property_manager.Device;
import com.building_mannager_system.enums.MessageStatus;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.chat.ChatMessageRepository;
import com.building_mannager_system.repository.chat.ChatRoomUserRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.utils.exception.APIException;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatRoomUserService {
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatRoomUserService(ChatRoomUserRepository chatRoomUserRepository,
                               ModelMapper modelMapper, UserRepository userRepository, ChatMessageRepository chatMessageRepository) {
        this.chatRoomUserRepository = chatRoomUserRepository;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public ChatRoomUserDto addUserToChatRoom(ChatRoomUser chatRoomUser) {
        return modelMapper.map(chatRoomUserRepository.save(chatRoomUser), ChatRoomUserDto.class);
    }

//    public List<Account> getAccountsByRoomId(Long roomId) {
//        // Lấy danh sách ChatRoomUser từ roomId
//        List<ChatRoomUser> chatRoomUsers = chatRoomUserRepository.findByChatRoomId(roomId);
//
//        // Trích xuất danh sách Account từ ChatRoomUser
//        return chatRoomUsers.stream()
//                .map(ChatRoomUser::getUser)
//                .collect(Collectors.toList());
//    }

    public ResultPaginationDTO getAllChatRoomUsersByUser(Specification<ChatRoomUser> spec, Pageable pageable) {
        // Lấy email người dùng hiện tại
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        // Tạo Specification cho ChatRoomUser
        Specification<ChatRoomUser> chatRoomUsersSpec = (root, query, criteriaBuilder) -> {
            Path<Long> chatRoomIdPath = root.get("chatRoom").get("id");

            Predicate chatRoomCondition = chatRoomIdPath.in(
                    chatRoomUserRepository.findChatRoomIdsByUser(user.getId())
            );

            Predicate userCondition = criteriaBuilder.notEqual(root.get("user").get("id"), user.getId());

            Predicate privateRoomCondition = criteriaBuilder.equal(root.get("chatRoom").get("isPrivate"), true);

            return criteriaBuilder.and(chatRoomCondition, userCondition, privateRoomCondition);
        };

        // Truy vấn danh sách người dùng trong phòng chat
        Page<ChatRoomUser> allUsersPage = chatRoomUserRepository.findAll(chatRoomUsersSpec, pageable);

        // Tạo đối tượng trả về ResultPaginationDTO
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(allUsersPage.getTotalPages());
        mt.setTotal(allUsersPage.getTotalElements());

        rs.setMeta(mt);

        // Tính số lượng tin nhắn chưa đọc cho từng phòng chat
        List<ChatRoomUserDto> list = allUsersPage.getContent()
                .stream()
                .map(item -> {
                    ChatRoomUserDto dto = modelMapper.map(item, ChatRoomUserDto.class);

                    // Lấy số lượng tin nhắn chưa đọc trong phòng chat
                    Long chatRoomId = item.getChatRoom().getId();
                    long unreadCount = chatMessageRepository.countByChatRoom_IdAndStatusNotAndCreatedByNot(chatRoomId, MessageStatus.READ, email);

                    // Gán số lượng tin nhắn chưa đọc vào DTO
                    dto.setUnreadCount(unreadCount);

                    return dto;
                })
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public ResultPaginationDTO getAllChatRoomGroupsByUser(Specification<ChatRoomUser> spec, Pageable pageable) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        Specification<ChatRoomUser> chatRoomUsersSpec = (root, query, criteriaBuilder) -> {
            Path<Long> chatRoomIdPath = root.get("chatRoom").get("id");

            Predicate chatRoomCondition = chatRoomIdPath.in(
                    chatRoomUserRepository.findChatRoomIdsByUser(user.getId())
            );

            Predicate userCondition = criteriaBuilder.notEqual(root.get("user").get("id"), user.getId());

            Predicate privateRoomCondition = criteriaBuilder.equal(root.get("chatRoom").get("isPrivate"), false);

            return criteriaBuilder.and(chatRoomCondition, userCondition, privateRoomCondition);
        };

        Page<ChatRoomUser> allUsersPage = chatRoomUserRepository.findAll(chatRoomUsersSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(allUsersPage.getTotalPages());
        mt.setTotal(allUsersPage.getTotalElements());

        rs.setMeta(mt);

        List<ChatRoomUserDto> list = allUsersPage.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ChatRoomUserDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }


    public void removeUserFromChatRoom(Long id) {
        ChatRoomUser ex = chatRoomUserRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Chat room user not found with ID: " + id));
        chatRoomUserRepository.delete(ex);
    }
}
