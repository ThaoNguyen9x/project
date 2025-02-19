package com.building_mannager_system.entity.customer_service.officeSpaceAllcation;

import com.building_mannager_system.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "CommonAreaTemplate")
public class CommonAreaTemplate  extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TemplateId", nullable = false)
    private Long id;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "color", nullable = true)
    private String color;

    @Column(name = "startX", nullable = false)
    private double startX;

    @Column(name = "startY", nullable = false)
    private double startY;

    @Column(name = "endX", nullable = false)
    private double endX;

    @Column(name = "endY", nullable = false)
    private double endY;

    @Column(name = "area", nullable = false)
    private double area;

    public void calculateArea() {
        this.area = (this.endX - this.startX) * (this.endY - this.startY);
    }
}
