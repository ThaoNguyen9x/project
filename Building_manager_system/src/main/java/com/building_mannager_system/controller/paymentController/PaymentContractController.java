package com.building_mannager_system.controller.paymentController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.paymentDto.PaymentContractDto;
import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.service.notification.NotificationPaymentContractService;
import com.building_mannager_system.service.payment.PaymentContractService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentContractController {
    private final PaymentContractService paymentContractService;
    private final NotificationPaymentContractService notificationPaymentContractService;

    public PaymentContractController(PaymentContractService paymentContractService,
                                     NotificationPaymentContractService notificationPaymentContractService) {
        this.paymentContractService = paymentContractService;
        this.notificationPaymentContractService = notificationPaymentContractService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách hợp đồng thanh toán thành công")
    public ResponseEntity<ResultPaginationDTO> getAllPaymentContracts(@Filter Specification<PaymentContract> spec,
                                                                      Pageable pageable) {
        return ResponseEntity.ok(paymentContractService.getAllPaymentContracts(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo hợp đồng thanh toán thành công")
    public ResponseEntity<PaymentContractDto> createPaymentContract(@RequestBody PaymentContract paymentContract) {
        return new ResponseEntity<>(paymentContractService.createPaymentContract(paymentContract), HttpStatus.CREATED);
    }

    @GetMapping("/contact")
    @ApiMessage("Lấy hợp đồng thanh toán thành công")
    public ResponseEntity<ResultPaginationDTO> getPaymentContractByCustomer(Pageable pageable) {

        return ResponseEntity.ok().body(paymentContractService.getPaymentContractByCustomer(pageable));
    }

    @PutMapping("/{paymentId}")
    @ApiMessage("Cập nhật hợp đồng thanh toán thành công")
    public ResponseEntity<PaymentContractDto> updatePaymentContract(@PathVariable(name = "paymentId") int paymentId,
                                                                    @RequestBody PaymentContract paymentContract) {
        return ResponseEntity.ok(paymentContractService.updatePaymentContract(paymentId, paymentContract));
    }

    @DeleteMapping("/{paymentId}")
    @ApiMessage("Xóa hợp đồng thanh toán thành công")
    public ResponseEntity<Void> deletePaymentContract(@PathVariable(name = "paymentId") int paymentId) {
        paymentContractService.deletePaymentContract(paymentId);
        return ResponseEntity.ok(null);
    }

    // Kế toán gửi thông báo thanh toán cho khách hàng
    @PostMapping("/sendPaymentRequest/{paymentId}")
    @ApiMessage("Gửi thông báo hợp đồng thanh toán thành công")
    public ResponseEntity<PaymentContractDto> sendPaymentContract(@PathVariable int paymentId) {
        notificationPaymentContractService.sendPaymentRequestNotificationToCustomer(paymentContractService.getPaymentContract(paymentId));
        return ResponseEntity.ok(null);
    }

    // Nhận thông báo từ khách hàng (ví dụ: thanh toán đã hoàn tất)
//    @MessageMapping("/paymentResponse")  // Lắng nghe các yêu cầu từ khách hàng tại "/app/paymentResponse"
//    @SendTo("/topic/paymentConfirmation")  // Gửi phản hồi lại cho tất cả các client
//    public String receivePaymentResponse(PaymentContractDto paymentResponse) {
//        // Xử lý thông báo thanh toán từ khách hàng
//        System.out.println("Received payment response: " + paymentResponse.getPaymentStatus());
//
//        // Gửi thông báo thanh toán đã hoàn tất
//        return "Payment confirmed: " + paymentResponse.getPaymentStatus();
//    }
}
