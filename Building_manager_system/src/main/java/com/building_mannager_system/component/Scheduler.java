package com.building_mannager_system.component;

import com.building_mannager_system.dto.requestDto.CheckPaymentNotificationDto;
import com.building_mannager_system.dto.requestDto.CustomerBirthdayNotificationDto;
import com.building_mannager_system.dto.responseDto.ContractResponceDto;
import com.building_mannager_system.service.customer_service.ContractService;
import com.building_mannager_system.service.customer_service.CustomerService;
import com.building_mannager_system.service.payment.PaymentContractService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Scheduler {

    private final CustomerService customerService;
    private final PaymentContractService paymentContractService;
    private final ContractService contractService;

    public Scheduler(CustomerService customerService, PaymentContractService paymentContractService, ContractService contractService) {
        this.customerService = customerService;
        this.paymentContractService = paymentContractService;
        this.contractService = contractService;
    }

    // Chạy lúc 8h sáng mỗi ngày
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkAndSendBirthdayNotifications() {
        List<CustomerBirthdayNotificationDto> customers = customerService.checkBirthDay();
        if (!customers.isEmpty()) {
            for (CustomerBirthdayNotificationDto customer : customers) {
                System.out.println("Happy Birthday, " + customer.getId() + "! 🎉 Wishing you a great year ahead!");
            }
        }
    }

    @Scheduled(cron = "0 0 8 * * ?") // Chạy vào 08:00 AM mỗi ngày
//     @Scheduled(cron = "*/1 * * * * *")
    public void duePaymentCheckNotifications() {
        List<CheckPaymentNotificationDto> payments = paymentContractService.checkDuePayment();
        if (!payments.isEmpty()) {
            for (CheckPaymentNotificationDto payment : payments) {
                System.out.println("Payment due, " + payment.getContract().getCustomer().getId());
            }
        }
    }

    @Scheduled(cron = "0 0 8 * * ?") // Chạy vào 08:00 AM mỗi ngày
//     @Scheduled(cron = "*/1 * * * * *")
    public void expPaymentCheckNotifications() {
        List<CheckPaymentNotificationDto> payments = paymentContractService.checkExpPayment();
        if (!payments.isEmpty()) {
            for (CheckPaymentNotificationDto payment : payments) {
                System.out.println("Payment exp, " + payment.getContract().getCustomer().getId());
            }
        }
    }

    @Scheduled(cron = "0 0 8 * * ?") // Chạy vào 08:00 AM mỗi ngày
//     @Scheduled(cron = "*/1 * * * * *")
    public void dueContractCheckNotifications() {
        List<ContractResponceDto> contracts = contractService.checkEndDateContract();
        if (!contracts.isEmpty()) {
            for (ContractResponceDto contract : contracts) {
                System.out.println("Contract due, " + contract.getCustomer().getId());
            }
        }
    }
}
