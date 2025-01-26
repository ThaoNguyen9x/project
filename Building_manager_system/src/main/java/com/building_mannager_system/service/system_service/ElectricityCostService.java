package com.building_mannager_system.service.system_service;

import com.building_mannager_system.entity.customer_service.system_manger.ElectricityRate;
import com.building_mannager_system.repository.system_manager.ElectricityRateRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ElectricityCostService {

    private final ElectricityRateRepository electricityRateRepository;

    public ElectricityCostService(ElectricityRateRepository electricityRateRepository) {
        this.electricityRateRepository = electricityRateRepository;
    }

    public BigDecimal calculateCost(BigDecimal usageAmount) {
        // Lấy danh sách bảng giá điện (đã sắp xếp theo mức tiêu thụ tăng dần)
        List<ElectricityRate> rates = electricityRateRepository.findAll();

        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal remainingUsage = usageAmount;

        for (ElectricityRate rate : rates) {
            // Tính toán lượng điện trong khoảng của bậc giá hiện tại
            BigDecimal tierUsage = calculateTierUsage(remainingUsage, rate);

            // Tính tiền cho bậc giá hiện tại
            BigDecimal tierCost = tierUsage.multiply(BigDecimal.valueOf(rate.getRate()));
            totalCost = totalCost.add(tierCost);

            // Giảm lượng điện còn lại
            remainingUsage = remainingUsage.subtract(tierUsage);

            // Nếu lượng điện còn lại <= 0, thoát vòng lặp
            if (remainingUsage.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }
        }

        return totalCost;
    }

    private BigDecimal calculateTierUsage(BigDecimal remainingUsage, ElectricityRate rate) {
        if (rate.getMaxUsage() == null) {
            // Nếu không có mức tiêu thụ tối đa (bậc cao nhất), sử dụng toàn bộ lượng điện còn lại
            return remainingUsage;
        }

        // Tính lượng điện sử dụng trong bậc giá hiện tại
        BigDecimal range = BigDecimal.valueOf(rate.getMaxUsage() - rate.getMinUsage() + 1);
        return remainingUsage.min(range);
    }
}
