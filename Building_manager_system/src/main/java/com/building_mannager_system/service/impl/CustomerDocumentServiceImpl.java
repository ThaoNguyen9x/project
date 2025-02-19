package com.building_mannager_system.service.impl;

import com.building_mannager_system.dto.requestDto.customer.CustomerDocumentDto;
import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDocumentDto;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerDocument;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerType;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerTypeDocument;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.repository.Contract.CustomerDocumentRepository;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.Contract.CustomerTypeDocumentRepository;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.service.customer_service.CustomerDocumentService;
import com.building_mannager_system.service.customer_service.CustomerTypeDocumentService;
import com.building_mannager_system.utils.exception.APIException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerDocumentServiceImpl implements CustomerDocumentService {
    private final CustomerDocumentRepository customerDocumentRepository;
    private final CustomerRepository customerRepository;
    private final CustomerTypeDocumentService customerTypeDocumentService;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    private final CustomerTypeDocumentRepository customerTypeDocumentRepository;

    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "customer_documents";
    List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx", "webp");

    public CustomerDocumentServiceImpl(CustomerDocumentRepository customerDocumentRepository,
                                       CustomerRepository customerRepository,
                                       CustomerTypeDocumentService customerTypeDocumentService,
                                       ModelMapper modelMapper,
                                       FileService fileService, CustomerTypeDocumentRepository customerTypeDocumentRepository) {
        this.customerDocumentRepository = customerDocumentRepository;
        this.customerRepository = customerRepository;
        this.customerTypeDocumentService = customerTypeDocumentService;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.customerTypeDocumentRepository = customerTypeDocumentRepository;
    }

    @Override
    @Transactional
    public CustomerDocumentDto saveCustomerDocument(MultipartFile path, CustomerDocument customerDocument) {
        // Tìm khách hàng theo ID
        if (customerDocument.getCustomer() != null) {
            Customer customer = customerRepository.findById(customerDocument.getCustomer().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + customerDocument.getCustomer().getId()));
            customerDocument.setCustomer(customer);
        }

        if (customerDocument.getCustomerTypeDocument() != null) {
            CustomerTypeDocument customerTypeDocument = customerTypeDocumentRepository.findById(customerDocument.getCustomerTypeDocument().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + customerDocument.getCustomerTypeDocument().getId()));
            customerDocument.setCustomerTypeDocument(customerTypeDocument);
        }

        fileService.validateFile(path, allowedExtensions);
        customerDocument.setFilePath(fileService.storeFile(path, folder));

        return modelMapper.map(customerDocumentRepository.save(customerDocument), CustomerDocumentDto.class);
    }

    @Override
    public CustomerDocumentDto updateCustomerDocument(int id, MultipartFile path, CustomerDocument customerDocument) throws URISyntaxException {
        CustomerDocument ex = customerDocumentRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer document not found with ID: " + id));

        if (customerDocument.getCustomer() != null) {
            Customer customer = customerRepository.findById(customerDocument.getCustomer().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + customerDocument.getCustomer().getId()));
            customerDocument.setCustomer(customer);
        }

        if (customerDocument.getCustomerTypeDocument() != null) {
            CustomerTypeDocument customerTypeDocument = customerTypeDocumentRepository.findById(customerDocument.getCustomerTypeDocument().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + customerDocument.getCustomerTypeDocument().getId()));
            customerDocument.setCustomerTypeDocument(customerTypeDocument);
        }

        if (path != null && !path.isEmpty()) {
            fileService.validateFile(path, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getFilePath() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getFilePath());
            }

            // Lưu tệp mới
            ex.setFilePath(fileService.storeFile(path, folder));
        }

        ex.setCustomer(customerDocument.getCustomer());
        ex.setCustomerTypeDocument(customerDocument.getCustomerTypeDocument());

        return modelMapper.map(customerDocumentRepository.save(ex), CustomerDocumentDto.class);
    }

    @Override
    public List<CustomerDocument> findByCustomer(Integer customerId) {
        return customerDocumentRepository.findByCustomerId(customerId);
    }

    @Override
    public List<String> findMissingDocumentsByCustomerId(Integer customerId) {
        // 1️⃣ Tìm khách hàng theo ID
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + customerId));

        // 2️⃣ Kiểm tra khách hàng có loại khách hàng không
        CustomerType customerType = Optional.ofNullable(customer.getCustomerType())
                .orElseThrow(() -> new IllegalStateException("Khách hàng chưa có loại khách hàng!"));

        // 3️⃣ Lấy danh sách tài liệu bắt buộc từ CustomerTypeDocument
        List<String> requiredDocuments = customerTypeDocumentService
                .findByCustomerTypeAndStatus(customerType.getId(), true) // true = tài liệu bắt buộc
                .stream()
                .map(CustomerTypeDocumentDto::getDocumentType) // ✅ Đổi sang CustomerTypeDocument (Entity thay vì DTO)
                .collect(Collectors.toList());

        // 4️⃣ Lấy danh sách tài liệu khách hàng đã nộp và được duyệt
        List<String> providedDocuments = customerDocumentRepository.findByCustomerId(customerId)
                .stream()
                .filter(CustomerDocument::isApproved) // ✅ Chỉ lấy tài liệu đã được duyệt
                .map(document -> document.getCustomerTypeDocument().getDocumentType()) // ✅ Dùng quan hệ khóa ngoại
                .collect(Collectors.toList());

        // 5️⃣ Xác định danh sách tài liệu còn thiếu
        return requiredDocuments.stream()
                .filter(doc -> !providedDocuments.contains(doc)) // ✅ Lọc ra tài liệu bắt buộc nhưng chưa được nộp
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public void updateDocumentStatus(Integer documentId, boolean isApproved) {
        CustomerDocument document = customerDocumentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài liệu với ID: " + documentId));
        document.setApproved(isApproved);
        customerDocumentRepository.save(document);
    }

    @Override
    public void deleteCustomerDocument(Integer documentId) {
        if (!customerDocumentRepository.existsById(documentId)) {
            throw new EntityNotFoundException("Không tìm thấy tài liệu với ID: " + documentId);
        }
        customerDocumentRepository.deleteById(documentId);
    }

    @Override
    public List<String> findSubmittedDocumentsByCustomerId(Integer customerId) {
        return customerDocumentRepository.findByCustomerId(customerId)
                .stream()
                .filter(CustomerDocument::isApproved) // ✅ Chỉ lấy tài liệu đã được duyệt
                .map(document -> document.getCustomerTypeDocument().getDocumentType()) // ✅ Lấy tên tài liệu từ quan hệ khóa ngoại
                .collect(Collectors.toList());
    }

}
