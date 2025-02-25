package com.building_mannager_system.entity.work_registration;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.enums.WorkStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "WorkRegistration")
@AllArgsConstructor
@NoArgsConstructor
public class WorkRegistration extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long registrationID;

    @ManyToOne
    @JoinColumn(name = "accountID", nullable = false)
    private User account; // Người đăng ký thi công

    @Column(nullable = false)
    private LocalDateTime registrationDate = LocalDateTime.now(); // Ngày đăng ký

    private LocalDateTime scheduledDate; // Ngày dự kiến thi công

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkStatus status = WorkStatus.PENDING; // Trạng thái đăng ký

    @Column(length = 500)
    private String note; // Ghi chú thêm

    @Column(length = 500)
    private String drawingUrl;  // ✅ Đường dẫn bản vẽ thi công (có thể null)
}
