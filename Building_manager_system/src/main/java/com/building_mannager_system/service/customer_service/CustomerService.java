package com.building_mannager_system.service.customer_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerType;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.Contract.CustomerTypeRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;
    private final CustomerTypeRepository customerTypeRepository;
    private final UserRepository userRepository;

    public CustomerService(CustomerRepository customerRepository,
                           ModelMapper modelMapper,
                           CustomerTypeRepository customerTypeRepository,
                           UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.modelMapper = modelMapper;
        this.customerTypeRepository = customerTypeRepository;
        this.userRepository = userRepository;
    }

    public ResultPaginationDTO getAllCustomers(Specification<Customer> spec,
                                               Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        if (user.getRole().getName().equals("USER")) {
            spec = spec.and((root, query, builder) -> builder.equal(root.get("user").get("id"), user.getId()));
        }

        Page<Customer> page = customerRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);

        List<CustomerDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, CustomerDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);
        return rs;
    }

    public CustomerDto createCustomer(Customer customer) {
        // Check customerType
        if (customer.getCustomerType() != null) {
            CustomerType customerType = customerTypeRepository.findById(customer.getCustomerType().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type not found with ID: " + customer.getCustomerType().getId()));
            customer.setCustomerType(customerType);
        }

        // Check user
        if (customer.getUser() != null) {
            User user = userRepository.findById(customer.getUser().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + customer.getUser().getId()));
            customer.setUser(user);
        }

        return modelMapper.map(customerRepository.save(customer), CustomerDto.class);
    }

    public CustomerDto getCustomer(int id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + id));

        return modelMapper.map(customer, CustomerDto.class);
    }

    public void deleteCustomer(int id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + id));

        try {
            customerRepository.delete(customer);
        } catch (DataIntegrityViolationException e) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Đang hoạt động không thể xóa");
        }
    }

    public CustomerDto updateCustomer(int id, Customer customer) {
        Customer ex = customerRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + id));

        // Check customerType
        if (customer.getCustomerType() != null) {
            CustomerType customerType = customerTypeRepository.findById(customer.getCustomerType().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type not found with ID: " + customer.getCustomerType().getId()));
            customer.setCustomerType(customerType);
        }

        // Check user
        if (customer.getUser() != null) {
            User user = userRepository.findById(customer.getUser().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + customer.getUser().getId()));
            customer.setUser(user);
        }

        ex.setCompanyName(customer.getCompanyName());
        ex.setEmail(customer.getEmail());
        ex.setPhone(customer.getPhone());
        ex.setAddress(customer.getAddress());
        ex.setStatus(customer.getStatus());
        ex.setDirectorName(customer.getDirectorName());
        ex.setBirthday(customer.getBirthday());
        ex.setCustomerType(customer.getCustomerType());
        ex.setUser(customer.getUser());

        return modelMapper.map(customerRepository.save(ex), CustomerDto.class);
    }

    public List<CustomerDto> checkBirthDay(){
        // Lấy ngày hôm nay
        LocalDate today = LocalDate.now();

        // Lấy ngày trong 3 ngày tới
        LocalDate targetDate = today.plusDays(3);

        // Lọc các khách hàng có sinh nhật trong 3 ngày tới
        List<CustomerDto> customersWithUpcomingBirthdays = customerRepository.findAll().stream()
                .filter(customer -> customer.getBirthday() != null)
                .filter(customer -> isBirthdayInNextThreeDays(customer.getBirthday(), today, targetDate))
                .map(item -> modelMapper.map(item, CustomerDto.class)) // Sử dụng Mapper để chuyển đổi Customer thành CustomerDto
                .collect(Collectors.toList());

        return customersWithUpcomingBirthdays;

    }

    // Kiểm tra xem sinh nhật có trong 3 ngày tới không
    private boolean isBirthdayInNextThreeDays(LocalDate birthday, LocalDate today, LocalDate targetDate) {
        // Chỉ so sánh ngày và tháng, không xét năm
        LocalDate nextBirthday = birthday.withYear(today.getYear());

        // Nếu ngày sinh nhật đã qua trong năm nay, lấy sinh nhật của năm sau
        if (nextBirthday.isBefore(today)) {
            nextBirthday = nextBirthday.withYear(today.getYear() + 1);
        }

        // Kiểm tra xem ngày sinh nhật có trong khoảng từ ngày hôm nay đến 3 ngày tới không
        return !nextBirthday.isBefore(today) && !nextBirthday.isAfter(targetDate);
    }
}
