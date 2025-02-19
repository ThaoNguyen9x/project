package com.building_mannager_system.entity.customer_service.officeSpaceAllcation;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.property_manager.Device;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "locations")
public class Location extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LocationId", nullable = false)
    private Integer id;

    @Column(name = "Floor")
    private String floor;

    @Column(name =  "numbeFloor")
    private Integer numberFloor;

    @Column(name = "totalArea", nullable = false)
    private double totalArea;

    @Column(name = "commonArea", nullable = false)
    private double commonArea;

    @Column(name = "netArea", nullable = false)
    private double netArea;

    @Column(name = "startX", nullable = false)
    private double startX;

    @Column(name = "startY", nullable = false)
    private double startY;

    @Column(name = "endX", nullable = false)
    private double endX;

    @Column(name = "endY", nullable = false)
    private double endY;

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CommonArea> commonAreas = new ArrayList<>(); // ✅ Khởi tạo danh sách tránh null

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Office> offices;

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Device> devices;

    public Location(String floor, Integer numberFloor, double commonArea, double netArea, double startX, double startY, double endX, double endY) {
        this.floor = floor;
        this.numberFloor = numberFloor;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.totalArea = (this.endX - this.startX) * (this.endY - this.startY);
        this.commonArea = commonArea;
        this.netArea = netArea;
    }

    public void calculateArea() {
        this.totalArea = (this.endX - this.startX) * (this.endY - this.startY);
    }

    public void applyCommonAreas(List<CommonAreaTemplate> templates) {

        if (this.commonAreas == null) {
            this.commonAreas = new ArrayList<>(); // ✅ Đảm bảo danh sách không null
        }

        for (CommonAreaTemplate template : templates) {
            CommonArea commonArea = new CommonArea();
            commonArea.setName(template.getName());
            commonArea.setColor(template.getColor());
            commonArea.setStartX(template.getStartX());
            commonArea.setStartY(template.getStartY());
            commonArea.setEndX(template.getEndX());
            commonArea.setEndY(template.getEndY());
            commonArea.setArea(template.getArea());
            commonArea.setLocation(this);
            this.commonAreas.add(commonArea);
        }
    }
}