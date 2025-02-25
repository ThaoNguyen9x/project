package com.building_mannager_system.entity.property_manager;


import jakarta.persistence.*;

@Entity
@DiscriminatorValue("FIRE_PUMP")
public class FirePumpDetail extends DeviceDetail{
    private int flowRate;  // Lưu lượng nước (lít/phút)
    private int pressure;  // Áp suất bơm (bar)

    public int getFlowRate() { return flowRate; }
    public void setFlowRate(int flowRate) { this.flowRate = flowRate; }

    public int getPressure() { return pressure; }
    public void setPressure(int pressure) { this.pressure = pressure; }
}
