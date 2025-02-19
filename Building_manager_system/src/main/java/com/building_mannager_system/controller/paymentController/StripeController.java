package com.building_mannager_system.controller.paymentController;

import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.entity.pament_entity.StripeResponse;
import com.building_mannager_system.service.payment.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripes")
public class StripeController {

    private StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/payment")
    public ResponseEntity<StripeResponse> payment(@RequestBody PaymentContract paymentContract) {
        return ResponseEntity.ok(stripeService.payment(paymentContract));
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
