package com.building_mannager_system.entity.customer_service.officeSpaceAllcation;

import com.building_mannager_system.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CommonArea")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommonArea extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CommonAreaId", nullable = false)
    private Long id;

    @Column(name = "Name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "LocationId", nullable = false)
    private Location location;

    @Column(name = "startX", nullable = false)
    private double startX;

    @Column(name = "color", nullable = true)
    private String color;

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

    public boolean isValidCommonArea() {
        return !(this.startX >= 30 && this.endX <= 44 &&
                this.startY >= 19 && this.endY <= 41);
    }

    public CommonArea(double area, String name, Location location, double endX, double endY, double startX, double startY, String color) {
        this.area = area;
        this.name = name;
        this.location = location;
        this.endX = endX;
        this.endY = endY;
        this.startX = startX;
        this.startY = startY;
        this.color = color;
    }
}
