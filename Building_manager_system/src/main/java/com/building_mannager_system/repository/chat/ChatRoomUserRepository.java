package com.building_mannager_system.repository.chat;

import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.chat.ChatRoomUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long>,
        JpaSpecificationExecutor<ChatRoomUser> {

    List<ChatRoomUser> findByChatRoom_Id(Long roomId);

    @Query("SELECT c.chatRoom.id FROM ChatRoomUser c WHERE c.user.id = :userId")
    List<Integer> findChatRoomIdsByUser(@Param("userId") Integer userId);
}
