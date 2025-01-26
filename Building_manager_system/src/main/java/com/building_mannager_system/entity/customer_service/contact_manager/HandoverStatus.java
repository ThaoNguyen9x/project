package com.building_mannager_system.entity.customer_service.contact_manager;

import com.building_mannager_system.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE)
@Table(name = "handoverstatus")
public class HandoverStatus extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HandoverId", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OfficeId")
    private Office office;

    @Column(name = "HandoverDate")
    private LocalDate handoverDate;

    @Lob
    @Column(name = "Status")
    private String status;

    @Column(name = "DrawingFile")
    private String drawingFile;

    @Column(name = "EquipmentFile")
    private String equipmentFile; //Ghi

}
