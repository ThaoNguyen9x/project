package com.building_mannager_system.entity.property_manager;

import jakarta.persistence.*;
@Entity
@DiscriminatorValue("FCU")
public class FcuDetail extends DeviceDetail{
    private int powerUsage;  // Công suất (Watt)
    private int fanSpeed;    // Số mức tốc độ quạt

    public int getPowerUsage() { return powerUsage; }
    public void setPowerUsage(int powerUsage) { this.powerUsage = powerUsage; }

    public int getFanSpeed() { return fanSpeed; }
    public void setFanSpeed(int fanSpeed) { this.fanSpeed = fanSpeed; }
}
