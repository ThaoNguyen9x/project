package com.building_mannager_system.controller.CustomerController;

import com.building_mannager_system.dto.requestDto.customer.CustomerDocumentDto;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerDocument;
import com.building_mannager_system.service.customer_service.CustomerDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-documents")
@RequiredArgsConstructor
public class CustomerDocumentController {
    private final CustomerDocumentService customerDocumentService;

    /**
     * API lấy danh sách tài liệu còn thiếu của khách hàng
     * @param customerId ID khách hàng
     * @return Danh sách tài liệu chưa nộp
     */
    @GetMapping("/{customerId}/missing")
    public ResponseEntity<List<String>> getMissingDocuments(@PathVariable Integer customerId) {
        List<String> missingDocuments = customerDocumentService.findMissingDocumentsByCustomerId(customerId);
        return ResponseEntity.ok(missingDocuments);
    }

    /**
     * API lấy danh sách tài liệu khách hàng đã nộp
     * @param customerId ID khách hàng
     * @return Danh sách tài liệu đã nộp
     */

    @GetMapping("/{customerId}/submitted")
    public ResponseEntity<List<String>> getSubmittedDocuments(@PathVariable Integer customerId) {
        List<String> submittedDocuments = customerDocumentService.findSubmittedDocumentsByCustomerId(customerId);
        return ResponseEntity.ok(submittedDocuments);
    }
    @PostMapping("/add")
    public ResponseEntity<CustomerDocumentDto> addCustomerDocument(@RequestBody CustomerDocumentDto customerDocumentDto) {
        CustomerDocumentDto savedDocument = customerDocumentService.saveCustomerDocument(customerDocumentDto);
        return ResponseEntity.ok(savedDocument);
    }
    /**
     * API cập nhật trạng thái tài liệu (duyệt hoặc từ chối)
     * @param documentId ID tài liệu
     * @param isApproved Trạng thái (true = đã duyệt, false = từ chối)
     * @return Trả về phản hồi thành công
     */
    @PutMapping("/{documentId}/approve")
    public ResponseEntity<Void> updateDocumentStatus(@PathVariable Integer documentId, @RequestParam boolean isApproved) {
        customerDocumentService.updateDocumentStatus(documentId, isApproved);
        return ResponseEntity.ok().build();
    }
}
