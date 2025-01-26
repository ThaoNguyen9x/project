package com.building_mannager_system.entity.property_manager;


import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.notification.NotificationMaintenance;
import com.building_mannager_system.enums.MaintenanceType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "maintenance_task")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
    public class MaintenanceTask extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_name", nullable = false)
    private String taskName;

    @Column(name = "task_description", nullable = false)
    private String taskDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type", nullable = false)
    private MaintenanceType maintenanceType; // Loại bảo trì (Định kỳ / Sự cố đột xuất)

    @JoinColumn(name = "assigned_to", nullable = false)
    @ManyToOne
    private User assignedTo; // Người thực hiện công việc

    @Column(name = "assigned_to_phone")
    private String assignedToPhone; // Số điện thoại của người thực hiện công việc

    @Column(name = "expected_duration", nullable = false)
    private Integer expectedDuration; // Thời gian dự kiến hoàn thành công việc (phút)

    @OneToMany(mappedBy = "maintenanceTask", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<NotificationMaintenance> notifications; // Liên kết với các thông báo bảo trì
}
