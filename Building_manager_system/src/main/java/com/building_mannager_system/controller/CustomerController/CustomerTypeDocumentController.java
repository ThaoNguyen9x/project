package com.building_mannager_system.controller.CustomerController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDocumentDto;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerTypeDocument;
import com.building_mannager_system.service.customer_service.CustomerTypeDocumentService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer-type-documents")
public class CustomerTypeDocumentController {

    private final CustomerTypeDocumentService customerTypeDocumentService;

    public CustomerTypeDocumentController(CustomerTypeDocumentService customerTypeDocumentService) {
        this.customerTypeDocumentService = customerTypeDocumentService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách hồ sơ phân loại thành công")
    public ResponseEntity<ResultPaginationDTO> getAllCustomerTypes(@Filter Specification<CustomerTypeDocument> spec,
                                                                   Pageable pageable) {
        return ResponseEntity.ok(customerTypeDocumentService.getAllCustomerTypeDocuments(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo hồ sơ phân loại thành công")
    public ResponseEntity<CustomerTypeDocumentDto> createCustomerType(@RequestBody CustomerTypeDocument customerTypeDocument) {
        return new ResponseEntity<>(customerTypeDocumentService.createCustomerTypeDocument(customerTypeDocument), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy hồ sơ phân loại thành công")
    public ResponseEntity<CustomerTypeDocumentDto> getCustomerType(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(customerTypeDocumentService.getCustomerTypeDocument(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật hồ sơ phân loại thành công")
    public ResponseEntity<CustomerTypeDocumentDto> updateCustomerType(@PathVariable(name = "id") int id,
                                                              @RequestBody CustomerTypeDocument customerTypeDocument) {
        return ResponseEntity.ok(customerTypeDocumentService.updateCustomerTypeDocument(id, customerTypeDocument));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa hồ sơ phân loại thành công")
    public ResponseEntity<Void> deleteCustomerType(@PathVariable(name = "id") int id) {
        customerTypeDocumentService.deleteCustomerTypeDocument(id);
        return ResponseEntity.ok(null);
    }
}
