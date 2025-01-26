package com.building_mannager_system.entity.work_registration;

import com.building_mannager_system.entity.User;
import com.building_mannager_system.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "RepairRequest")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RepairRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestID;

    @ManyToOne
    @JoinColumn(name = "accountID", nullable = false)
    private User account;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    @Column(columnDefinition = "TEXT")
    private String content;

    // ✅ Sử dụng Enum cho trạng thái yêu cầu
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(length = 500)
    private String imageUrl;  // ✅ Đường dẫn ảnh lưu trữ
}
