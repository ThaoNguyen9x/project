package com.building_mannager_system.service.payment;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.CheckPaymentNotificationDto;
import com.building_mannager_system.dto.requestDto.paymentDto.PaymentContractDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.enums.PaymentStatus;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.Contract.ContractRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.paymentRepository.PaymentContractRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.notification.NotificationService;
import com.building_mannager_system.service.notification.RecipientService;
import com.building_mannager_system.untils.JsonUntils;
import com.building_mannager_system.utils.exception.APIException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentContractService {

    private final PaymentContractRepository paymentContractRepository;
    private final ModelMapper modelMapper;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final RecipientService recipientService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public PaymentContractService(PaymentContractRepository paymentContractRepository,
                                  ModelMapper modelMapper,
                                  ContractRepository contractRepository,
                                  UserRepository userRepository,
                                  FilterParser filterParser,
                                  FilterSpecificationConverter filterSpecificationConverter,
                                  RecipientService recipientService,
                                  NotificationService notificationService,
                                  SimpMessagingTemplate messagingTemplate) {
        this.paymentContractRepository = paymentContractRepository;
        this.modelMapper = modelMapper;
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.filterParser = filterParser;
        this.filterSpecificationConverter = filterSpecificationConverter;
        this.recipientService = recipientService;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
    }

    public ResultPaginationDTO getAllPaymentContracts(Specification<PaymentContract> spec,
                                                      Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        if (user.getRole().getName().equals("Customer")) {
            spec = spec.and((root, query, builder) ->
                    builder.equal(root.get("contract").get("customer").get("user").get("id"), user.getId())
            );
        }

        Page<PaymentContract> page = paymentContractRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<PaymentContractDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, PaymentContractDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public PaymentContractDto createPaymentContract(PaymentContract paymentContract) {
        // Check contract
        if (paymentContract.getContract() != null) {
            Contract contract = contractRepository.findById(paymentContract.getContract().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + paymentContract.getContract().getId()));
            paymentContract.setContract(contract);
        }

        return modelMapper.map(paymentContractRepository.save(paymentContract), PaymentContractDto.class);
    }

    public PaymentContractDto updatePaymentContract(int paymentId, PaymentContract paymentContract) {

        PaymentContract existingContract = paymentContractRepository.findById(paymentId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Payment contract not found with ID: " + paymentId));

        if (paymentContract.getContract() != null && paymentContract.getContract().getId() != null) {
            Contract contract = contractRepository.findById(paymentContract.getContract().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND,
                            "Contract not found with ID: " + paymentContract.getContract().getId()));
            existingContract.setContract(contract);
        }

        existingContract.setPaymentDate(paymentContract.getPaymentDate());
        existingContract.setDueDate(paymentContract.getDueDate());
        existingContract.setPaymentAmount(paymentContract.getPaymentAmount());
        existingContract.setPaymentStatus(paymentContract.getPaymentStatus());

        PaymentContract updatedContract = paymentContractRepository.save(existingContract);
        return modelMapper.map(updatedContract, PaymentContractDto.class);
    }


    public void deletePaymentContract(int paymentId) {
        PaymentContract paymentContract = paymentContractRepository.findById(paymentId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Payment contract not found with ID: " + paymentId));

        paymentContractRepository.delete(paymentContract);
    }

    public PaymentContractDto getPaymentContract(int paymentId) {
        PaymentContract paymentContract = paymentContractRepository.findById(paymentId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Payment contract not found with ID: " + paymentId));

        return modelMapper.map(paymentContract, PaymentContractDto.class);
    }

    // Thanh toán còn 1 ngày thì hết hạn
    private void sendPaymentNotification(PaymentContract payment, String type, String name) throws JsonProcessingException {
        if (payment == null || payment.getContract() == null || payment.getContract().getCustomer() == null) {
            return;
        }

        User customer = payment.getContract().getCustomer().getUser();
        if (customer == null) {
            return;
        }

        String message = JsonUntils.toJson(modelMapper.map(payment, PaymentContractDto.class));

        // Gửi cho admin
        List<String> roles = List.of("Application_Admin");
        List<User> admins = userRepository.findByRole_NameIn(roles);
        admins.forEach(admin -> sendNotification(admin, message, type, name));

        // Gửi cho khách hàng
        sendNotification(customer, message, type, name);
    }

    public List<CheckPaymentNotificationDto> checkExpPayment() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1); // Đúng là ngày đã quá hạn

        List<PaymentContract> overduePayments = paymentContractRepository.findByDueDateAndPaymentStatus(yesterday, PaymentStatus.UNPAID);

        List<CheckPaymentNotificationDto> overduePaymentDtos = overduePayments.stream()
                .map(payment -> modelMapper.map(payment, CheckPaymentNotificationDto.class))
                .collect(Collectors.toList());

        overduePayments.forEach(payment -> {
            try {
                sendPaymentNotification(payment, "Exp_Payment_Notification", "Send Exp Payment Notifications");
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });

        return overduePaymentDtos;
    }

    public List<CheckPaymentNotificationDto> checkDuePayment() {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        List<PaymentContract> duePayments = paymentContractRepository.findByDueDateAndPaymentStatus(tomorrow, PaymentStatus.UNPAID);

        List<CheckPaymentNotificationDto> duePaymentDtos = duePayments.stream()
                .map(payment -> modelMapper.map(payment, CheckPaymentNotificationDto.class))
                .collect(Collectors.toList());

        duePayments.forEach(payment -> {
            try {
                sendPaymentNotification(payment, "Due_Payment_Notification", "Send Due Payment Notifications");
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });

        return duePaymentDtos;
    }

    private void sendNotification(User user, String message, String type, String name) {
        if (user == null) return;

        Recipient rec = new Recipient();
        rec.setType(type);
        rec.setName(name);
        rec.setReferenceId(user.getId());

        Recipient recipient = recipientService.createRecipient(rec);

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setStatus(StatusNotifi.PENDING);
        notification.setCreatedAt(LocalDateTime.now());

        notificationService.createNotification(notification);

        messagingTemplate.convertAndSend("/topic/" + type.toLowerCase() + "/" + user.getId(), message);
    }
}
