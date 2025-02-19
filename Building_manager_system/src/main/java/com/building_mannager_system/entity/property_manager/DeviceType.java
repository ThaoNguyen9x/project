package com.building_mannager_system.entity.property_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "device_type")
public class DeviceType extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_type_id", nullable = false)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "type_name", nullable = false)
    private String typeName;

    @OneToMany(mappedBy = "deviceType")
    @JsonIgnore
    private List<Device> devices;

    public DeviceType(String description, String typeName) {
        this.description = description;
        this.typeName = typeName;
    }
}
