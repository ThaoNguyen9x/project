package com.building_mannager_system.controller.CustomerController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDto;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerType;
import com.building_mannager_system.service.customer_service.CustomerTypeService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer-types")
public class CustomerTypeController {

    private final CustomerTypeService customerTypeService;

    public CustomerTypeController(CustomerTypeService customerTypeService) {
        this.customerTypeService = customerTypeService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách loại khách hàng thành công")
    public ResponseEntity<ResultPaginationDTO> getAllCustomerTypes(@Filter Specification<CustomerType> spec,
                                                                   Pageable pageable) {
        return ResponseEntity.ok(customerTypeService.getAllCustomerTypes(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo loại khách hàng thành công")
    public ResponseEntity<CustomerTypeDto> createCustomerType(@RequestBody CustomerType customerType) {
        return new ResponseEntity<>(customerTypeService.createCustomerType(customerType), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy loại khách hàng thành công")
    public ResponseEntity<CustomerTypeDto> getCustomerType(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(customerTypeService.getCustomerType(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật loại khách hàng thành công")
    public ResponseEntity<CustomerTypeDto> updateCustomerType(@PathVariable(name = "id") int id,
                                                              @RequestBody CustomerType customerType) {
        return ResponseEntity.ok(customerTypeService.updateCustomerType(id, customerType));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa loại khách hàng thành công")
    public ResponseEntity<Void> deleteCustomerType(@PathVariable(name = "id") int id) {
        customerTypeService.deleteCustomerType(id);
        return ResponseEntity.ok(null);
    }
}
