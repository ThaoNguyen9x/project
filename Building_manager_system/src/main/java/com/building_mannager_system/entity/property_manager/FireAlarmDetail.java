package com.building_mannager_system.entity.property_manager;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("FIRE_ALARM")
public class FireAlarmDetail extends DeviceDetail{
    private double sensitivity; // Độ nhạy của cảm biến khói/nhiệt

    public double getSensitivity() { return sensitivity; }
    public void setSensitivity(double sensitivity) { this.sensitivity = sensitivity; }
}
