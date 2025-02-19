package com.building_mannager_system.service.customer_service;

import com.building_mannager_system.dto.requestDto.customer.CustomerDocumentDto;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerDocument;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;
import java.util.List;

public interface CustomerDocumentService {
    // Lưu tài liệu khách hàng
    CustomerDocumentDto saveCustomerDocument(MultipartFile path, CustomerDocument customerDocument);

    CustomerDocumentDto updateCustomerDocument(int id, MultipartFile path, CustomerDocument customerDocument) throws URISyntaxException;

    // Lấy danh sách tài liệu mà khách hàng đã cung cấp
    List<CustomerDocument> findByCustomer(Integer customerId);

    // Kiểm tra khách hàng còn thiếu tài liệu nào
    List<String> findMissingDocumentsByCustomerId(Integer customerId);

    // Cập nhật trạng thái tài liệu (duyệt hoặc từ chối)
    void updateDocumentStatus(Integer documentId, boolean isApproved);

    // Xóa tài liệu của khách hàng (nếu cần)
    void deleteCustomerDocument(Integer documentId);
    // Lấy danh sách tài liệu khách hàng đã nộp và được duyệt
    List<String> findSubmittedDocumentsByCustomerId(Integer customerId);
}
