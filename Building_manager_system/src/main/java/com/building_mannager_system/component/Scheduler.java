package com.building_mannager_system.component;

import com.building_mannager_system.dto.requestDto.CustomerBirthdayNotificationDto;
import com.building_mannager_system.service.customer_service.CustomerService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BirthdayScheduler {

    private final CustomerService customerService;

    public BirthdayScheduler(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Chạy lúc 8h sáng mỗi ngày
    @Scheduled(cron = "0 0 8 * * ?")
    // @Scheduled(cron = "*/1 * * * * *")
    public void checkAndSendBirthdayNotifications() {
        System.out.println("🔔 Checking for upcoming birthdays...");

        List<CustomerBirthdayNotificationDto> customers = customerService.checkBirthDay();
        if (customers.isEmpty()) {
            System.out.println("✅ No upcoming birthdays.");
        } else {
            System.out.println("🎉 Sent birthday notifications for " + customers.size() + " customers!");
        }
    }
}
