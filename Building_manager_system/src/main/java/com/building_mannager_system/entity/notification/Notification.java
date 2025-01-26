package com.building_mannager_system.entity.notification;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.enums.StatusNotifi;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // ID duy nhất cho mỗi thông báo

    @ManyToOne()
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient; // Liên kết với đối tượng Recipient

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusNotifi status = StatusNotifi.PENDING; // Trạng thái thông báo (PENDING, SENT, READ)

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); // Thời gian tạo thông báo

    private String notificationType;

    @Column(nullable = true)
    private LocalDateTime sentAt; // Thời gian gửi thông báo (nếu đã gửi)
}
