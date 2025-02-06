package com.building_mannager_system.service.payment;

import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.entity.pament_entity.StripeResponse;
import com.building_mannager_system.enums.PaymentStatus;
import com.building_mannager_system.repository.paymentRepository.PaymentContractRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StripeService {

    private final PaymentContractRepository paymentContractRepository;
    @Value("${stripe.publishable.key}")
    private String publishableKey;

    @Value("${stripe.secret.key}")
    private String secretKey;

    @Value("${frontend.url}")
    private String frontendUrl;

    public StripeService(PaymentContractRepository paymentContractRepository) {
        this.paymentContractRepository = paymentContractRepository;
    }

    // Thanh toán
    public StripeResponse payment(PaymentContract paymentContract) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        Stripe.apiKey = secretKey;

        try {
            // Create product data, price, and payment session
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName("Thông tin thanh toán")
                            .build();

            // Price data
            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("VND")
                            .setUnitAmountDecimal(paymentContract.getPaymentAmount())
                            .setProductData(productData)
                            .build();

            // Create payment line item
            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(priceData)
                            .build();

            // Create session parameters
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendUrl + "/dashboard/payment-contracts?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendUrl + "/dashboard/payment-contracts?session_id={CHECKOUT_SESSION_ID}")
                    .setCustomerEmail(email)
                    .addLineItem(lineItem)
                    .build();

            // Create Stripe session
            Session session = Session.create(params);

            // Save the sessionId to the PaymentContract before redirecting
            paymentContract.setSessionId(session.getId());
            paymentContractRepository.save(paymentContract);

            return StripeResponse.builder()
                    .status("SUCCESS")
                    .message("Payment session created successfully")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();

        } catch (StripeException e) {
            return StripeResponse.builder()
                    .status("FAILED")
                    .message("Payment session creation failed: " + e.getMessage())
                    .build();
        }
    }

    // Thay đổi trạng thái khi thanh toán thành công
    public boolean paymentSuccess(String sessionId) {
        Stripe.apiKey = secretKey;

        try {
            Session session = Session.retrieve(sessionId);

            if ("paid".equalsIgnoreCase(session.getPaymentStatus())) {
                Optional<PaymentContract> optionalPaymentContract = paymentContractRepository.findBySessionId(sessionId);

                if (optionalPaymentContract.isPresent()) {
                    PaymentContract paymentContract = optionalPaymentContract.get();
                    paymentContract.setPaymentStatus(PaymentStatus.PAID);
                    paymentContractRepository.save(paymentContract);
                    return true;
                }
            }
        } catch (StripeException e) {
            System.err.println("Error retrieving payment status: " + e.getMessage());
        }

        return false;
    }
}
