package com.building_mannager_system.entity.chat;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.enums.MessageStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_messages")
public class ChatMessage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false) // Liên kết đến ChatRoom
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Liên kết đến Account
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING) // Lưu trạng thái dưới dạng chuỗi
    private MessageStatus status = MessageStatus.SENT; // Mặc định là Sent
}