package com.building_mannager_system.repository.chat;

import com.building_mannager_system.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long>,
        JpaSpecificationExecutor<ChatRoom> {
        @Query("SELECT cr FROM ChatRoom cr " +
                "JOIN cr.users cru1 " +
                "JOIN cr.users cru2 " +
                "WHERE cr.isPrivate = true " +
                "AND cru1.user.id = :userId1 " +
                "AND cru2.user.id = :userId2")
        List<ChatRoom> findPrivateRoomByUserPair(@Param("userId1") int userId1, @Param("userId2") int userId2);

        @Query("SELECT cr FROM ChatRoom cr JOIN cr.users cru WHERE cr.isPrivate = false " +
                "AND cru.user.id IN :accountIds GROUP BY cr.id HAVING COUNT(cru.user.id) = :count")
        List<ChatRoom> findGroupChatByUsers(@Param("accountIds") List<Integer> accountIds, @Param("count") long count);

}
