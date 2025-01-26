package com.building_mannager_system.controller.CustomerController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.service.customer_service.CustomerService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách khách hàng thành công")
    public ResponseEntity<ResultPaginationDTO> getAllCustomers(@Filter Specification<Customer> spec,
                                                               Pageable pageable) {
        return ResponseEntity.ok(customerService.getAllCustomers(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo khách hàng thành công")
    public ResponseEntity<CustomerDto> createCustomer(@RequestBody Customer customer) {
        return new ResponseEntity<>(customerService.createCustomer(customer), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy khách hàng thành công")
    public ResponseEntity<CustomerDto> getCustomer(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(customerService.getCustomer(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật khách hàng thành công")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable(name = "id") int id,
                                                      @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa khách hàng thành công")
    public ResponseEntity<Void> deleteCustomer(@PathVariable(name = "id") int id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(null);
    }
}
