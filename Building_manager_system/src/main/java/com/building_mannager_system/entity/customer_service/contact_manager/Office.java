package com.building_mannager_system.entity.customer_service.contact_manager;

import com.building_mannager_system.entity.BaseEntity;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.CommonArea;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "office")
public class Office extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OfficeId", nullable = false)
    private Integer id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "LocationId")
    private Location location;

    @Column(name = "Area", precision = 15, scale = 2)
    private BigDecimal totalArea;

    @Column(name = "RentPrice", precision = 15, scale = 2)
    private BigDecimal rentPrice;

    @Column(name = "ServiceFee", precision = 15, scale = 2)
    private BigDecimal serviceFee;

    @Column(name = "startX", nullable = false)
    private double startX;

    @Column(name = "startY", nullable = false)
    private double startY;

    @Column(name = "endX", nullable = false)
    private double endX;

    @Column(name = "endY", nullable = false)
    private double endY;

    @Lob
    @Column(name = "Status")
    private String status = "ACTIV";

    @Column(name = "DrawingFile")
    private String drawingFile;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "office")
    @JsonIgnore
    private List<Meter> meters = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "office")
    @JsonIgnore
    private List<Contract> contracts;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "office")
    @JsonIgnore
    private List<HandoverStatus> handoverStatuses;

    public boolean isValidOffice(List<CommonArea> commonAreas) {
        for (CommonArea area : commonAreas) {
            if (!(this.endX <= area.getStartX() || this.startX >= area.getEndX() ||
                    this.endY <= area.getStartY() || this.startY >= area.getEndY())) {

                System.out.println("❌ Office bị chồng lấn với CommonArea ID: " + area.getId() +
                        ", Name: " + area.getName());

                return false;
            }
        }
        return true;
    }

    public void calculateArea() {
        this.totalArea = BigDecimal.valueOf(BigDecimal.valueOf(this.endX - this.startX)
                .multiply(BigDecimal.valueOf(this.endY - this.startY))
                .doubleValue());
    }
}