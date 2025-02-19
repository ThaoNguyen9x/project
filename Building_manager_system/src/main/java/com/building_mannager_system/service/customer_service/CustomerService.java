package com.building_mannager_system.service.customer_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.CustomerBirthdayNotificationDto;
import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerType;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.Contract.CustomerTypeRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.notification.NotificationService;
import com.building_mannager_system.service.notification.RecipientService;
import com.building_mannager_system.untils.JsonUntils;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;
    private final CustomerTypeRepository customerTypeRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final RecipientService recipientService;

    public CustomerService(CustomerRepository customerRepository,
                           ModelMapper modelMapper,
                           CustomerTypeRepository customerTypeRepository,
                           UserRepository userRepository,
                           SimpMessagingTemplate messagingTemplate,
                           NotificationService notificationService,
                           RecipientService recipientService) {
        this.customerRepository = customerRepository;
        this.modelMapper = modelMapper;
        this.customerTypeRepository = customerTypeRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
        this.notificationService = notificationService;
        this.recipientService = recipientService;
    }

    public ResultPaginationDTO getAllCustomers(Specification<Customer> spec,
                                               Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        if (user.getRole().getName().equals("Customer")) {
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

    @Transactional
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

    public List<CustomerBirthdayNotificationDto> checkBirthDay() {
        LocalDate today = LocalDate.now();
        LocalDate nextThreeDays = today.plusDays(3);

        // Chuyển ngày thành chuỗi 'MM-dd' để truy vấn
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");
        String todayStr = today.format(formatter);
        String nextThreeDaysStr = nextThreeDays.format(formatter);

        List<Customer> customersWithUpcomingBirthdays = customerRepository.findCustomersWithBirthdayInRange(todayStr, nextThreeDaysStr);

        List<CustomerBirthdayNotificationDto> birthdayDtos = customersWithUpcomingBirthdays.stream()
                .map(customer -> modelMapper.map(customer, CustomerBirthdayNotificationDto.class))
                .collect(Collectors.toList());

        for (Customer customer : customersWithUpcomingBirthdays) {
            sendBirthdayNotification(customer);
        }

        return birthdayDtos;
    }

    // Gửi thông báo đến khách hàng có sinh nhật
    public void sendBirthdayNotification(Customer customer) {
        try {
            List<String> roles = List.of("Application_Admin");
            List<User> recipients = userRepository.findByRole_NameIn(roles);

            if (recipients.isEmpty()) {
                return;
            }

            String message = JsonUntils.toJson(modelMapper.map(customer, CustomerBirthdayNotificationDto.class));

            for (User user : recipients) {
                Recipient rec = new Recipient();
                rec.setType("Birthday_Notification");
                rec.setName("Send Birthday Notification");
                rec.setReferenceId(user.getId());

                Recipient recipient = recipientService.createRecipient(rec);

                Notification notification = new Notification();
                notification.setRecipient(recipient);
                notification.setMessage(message);
                notification.setStatus(StatusNotifi.PENDING);
                notification.setCreatedAt(LocalDateTime.now());

                notificationService.createNotification(notification);

                messagingTemplate.convertAndSend("/topic/birthday-notifications/" + user.getId(), message);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
