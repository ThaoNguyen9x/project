package com.building_mannager_system.repository.chat;

import com.building_mannager_system.entity.chat.ChatMessage;
import com.building_mannager_system.enums.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository  extends JpaRepository<ChatMessage, Long>,
        JpaSpecificationExecutor<ChatMessage> {

    List<ChatMessage> findByChatRoomId(Long chatRoomId);

    long countByChatRoom_IdAndStatusNotAndCreatedByNot(Long chatRoomId, MessageStatus status, String createdBy);
}
