package com.building_mannager_system.entity;

import com.building_mannager_system.entity.chat.ChatRoomUser;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.property_manager.MaintenanceHistory;
import com.building_mannager_system.entity.property_manager.MaintenanceTask;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String email;

    private String mobile;

    private String password;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;

    private boolean status = true;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToOne(mappedBy = "user")
    private Customer customer;

    @OneToMany(mappedBy = "technician", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MaintenanceHistory> maintenanceHistories;

    @OneToMany(mappedBy = "assignedTo", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MaintenanceTask> maintenanceTasks;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ChatRoomUser> chatRoomUsers;

    @Column(name = "is_online")
    private Boolean isOnline = false;  // Mặc định là offline khi tài khoản được tạo

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
