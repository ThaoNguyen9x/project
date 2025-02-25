package com.building_mannager_system.entity.property_manager;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SPRINKLER")
public class SprinklerDetail extends DeviceDetail{
    private double activationTemperature; // Nhiệt độ kích hoạt (°C)
    private String type; // Loại sprinkler (phun sương, phun trần, v.v.)

    public double getActivationTemperature() { return activationTemperature; }
    public void setActivationTemperature(double activationTemperature) { this.activationTemperature = activationTemperature; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
