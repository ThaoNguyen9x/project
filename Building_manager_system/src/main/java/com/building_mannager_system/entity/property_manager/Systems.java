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
@Table(name="systems")
public class Systems extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Or Integer, depending on your database

    private String systemName;

    private String description;

    private int maintenanceCycle;

    @OneToMany(mappedBy = "system", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Subcontractor> subcontractors;

    public Systems(String systemName, int maintenanceCycle) {
        this.systemName = systemName;
        this.maintenanceCycle = maintenanceCycle;
    }
}
