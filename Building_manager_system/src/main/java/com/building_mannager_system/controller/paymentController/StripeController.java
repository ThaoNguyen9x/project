package com.building_mannager_system.controller.paymentController;

import com.building_mannager_system.dto.requestDto.paymentDto.PaymentContractDto;
import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.entity.pament_entity.StripeResponse;
import com.building_mannager_system.service.notification.NotificationPaymentContractService;
import com.building_mannager_system.service.payment.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/stripes")
public class StripeController {

    private final NotificationPaymentContractService notificationPaymentContractService;
    private StripeService stripeService;

    public StripeController(StripeService stripeService, NotificationPaymentContractService notificationPaymentContractService) {
        this.stripeService = stripeService;
        this.notificationPaymentContractService = notificationPaymentContractService;
    }

    @PostMapping("/payment")
    public ResponseEntity<StripeResponse> payment(@RequestBody PaymentContract paymentContract) {
        StripeResponse stripeResponse = stripeService.payment(paymentContract);

        // Chuyển đổi từ PaymentContract sang PaymentContractDto
        PaymentContractDto dto = new PaymentContractDto();
        dto.setPaymentId(paymentContract.getPaymentId());
        dto.setPaymentAmount(paymentContract.getPaymentAmount());
        dto.setPaymentDate(LocalDate.now());

        notificationPaymentContractService.sendPaymentSuccess(dto);

        return ResponseEntity.ok(stripeResponse);
    }

    @GetMapping("/payment-success")
    public ResponseEntity<String> paymentSuccess(@RequestParam("session_id") String sessionId) {
        boolean isPaid = stripeService.paymentSuccess(sessionId);
        if (isPaid) {
            return ResponseEntity.ok("Success");
        } else {
            return ResponseEntity.badRequest().body("Fail");
        }
    }
}
