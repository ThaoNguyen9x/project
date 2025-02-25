package com.building_mannager_system.entity.property_manager;

import jakarta.persistence.*;
@Entity
@DiscriminatorValue("PUMP")
public class PumpDetail extends DeviceDetail{
    private int flowRate;  // Lưu lượng nước (lít/phút)
    private int pressure;  // Áp suất bơm (bar)
    private String pumpType; // Loại bơm (chữa cháy, tăng áp...)

    public int getFlowRate() {
        return flowRate;
    }

    public void setFlowRate(int flowRate) {
        this.flowRate = flowRate;
    }

    public int getPressure() {
        return pressure;
    }

    public void setPressure(int pressure) {
        this.pressure = pressure;
    }

    public String getPumpType() {
        return pumpType;
    }

    public void setPumpType(String pumpType) {
        this.pumpType = pumpType;
    }
}
