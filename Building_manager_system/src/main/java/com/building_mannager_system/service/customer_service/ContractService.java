package com.building_mannager_system.service.customer_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.ContractDto.ContractDto;
import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDocumentDto;
import com.building_mannager_system.dto.responseDto.ContractReminderDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.contact_manager.HandoverStatus;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerDocument;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerTypeDocument;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.building_mannager_system.repository.Contract.ContractRepository;
import com.building_mannager_system.repository.Contract.CustomerDocumentRepository;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.Contract.HandoverStatusRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.office.OfficeRepository;
import com.building_mannager_system.repository.system_manager.MeterRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.utils.exception.APIException;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ContractService {
    private final UserRepository userRepository;
    private final CustomerTypeDocumentService customerTypeDocumentService;
    private final CustomerDocumentRepository customerDocumentRepository;
    private final HandoverStatusRepository handoverStatusRepository;
    private final MeterRepository meterRepository;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "contracts";
    List<String> allowedExtensions = Arrays.asList("pdf");

    private final OfficeRepository officeRepository;
    private final CustomerRepository customerRepository;
    private final ContractRepository contractRepository;
    private final FileService fileService;
    private final ModelMapper modelMapper;

    public ContractService(ContractRepository contractRepository,
                           ModelMapper modelMapper,
                           OfficeRepository officeRepository,
                           CustomerRepository customerRepository, FileService fileService, UserRepository userRepository, CustomerTypeDocumentService customerTypeDocumentService, CustomerDocumentRepository customerDocumentRepository, HandoverStatusRepository handoverStatusRepository, MeterRepository meterRepository) {
        this.contractRepository = contractRepository;
        this.modelMapper = modelMapper;
        this.officeRepository = officeRepository;
        this.customerRepository = customerRepository;
        this.fileService = fileService;
        this.userRepository = userRepository;
        this.customerTypeDocumentService = customerTypeDocumentService;
        this.customerDocumentRepository = customerDocumentRepository;
        this.handoverStatusRepository = handoverStatusRepository;
        this.meterRepository = meterRepository;
    }

    public ResultPaginationDTO getAllContracts(Specification<Contract> spec, Pageable pageable) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        if (user.getRole().getName().equals("Customer")) {
            spec = spec.and((root, query, builder) ->
                    builder.equal(root.get("customer").get("user").get("id"), user.getId())
            );
        }

        Page<Contract> page = contractRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);

        List<ContractDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ContractDto.class))
                .collect(Collectors.toList());

        for (ContractDto contractDto : list) {
            if (contractDto.getCustomer() != null) {
                // Lọc customerTypeDocuments cho mỗi Customer của contract
                contractDto.getCustomer().getCustomerType().getCustomerTypeDocuments().forEach(customerTypeDocumentDto -> {
                    customerTypeDocumentDto.setCustomerDocuments(customerTypeDocumentDto.getCustomerDocuments().stream()
                            // Lọc customerDocuments của từng CustomerTypeDocumentDto theo customerId của contract
                            .filter(customerDocumentDto -> customerDocumentDto.getCustomerId() != null
                                    && customerDocumentDto.getCustomerId().equals(contractDto.getCustomer().getId()))
                            .collect(Collectors.toList()));
                });
            }
        }

        rs.setResult(list);
        return rs;
    }

    public ContractDto createContract(MultipartFile drawingContract, Contract contract) {
        // Check office
        if (contract.getOffice() != null) {
            Office office = officeRepository.findById(contract.getOffice().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + contract.getOffice().getId()));
            contract.setOffice(office);

            BigDecimal totalAmount = office.getTotalArea()
                    .multiply(office.getRentPrice())
                    .multiply(office.getServiceFee())
                    .multiply(BigDecimal.valueOf(ChronoUnit.MONTHS.between(contract.getStartDate(), contract.getEndDate())));

            contract.setTotalAmount(totalAmount);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Office information is invalid or missing");
        }

        // Check customer
        if (contract.getCustomer() != null) {
            Customer customer = customerRepository.findById(contract.getCustomer().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + contract.getCustomer().getId()));
            contract.setCustomer(customer);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Customer information is invalid or missing");
        }

        fileService.validateFile(drawingContract, allowedExtensions);
        contract.setFileName(fileService.storeFile(drawingContract, folder));

        return modelMapper.map(contractRepository.save(contract), ContractDto.class);
    }

    public ContractDto getContract(int id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + id));

        return modelMapper.map(contract, ContractDto.class);
    }

    public ContractDto updateContract(int id, MultipartFile drawingContract, Contract contract) throws URISyntaxException {
        Contract ex = contractRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + id));

        // Check office
        if (contract.getOffice() != null) {
            Office office = officeRepository.findById(contract.getOffice().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + contract.getOffice().getId()));
            contract.setOffice(office);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Office information is invalid or missing");
        }

        // Check customer
        if (contract.getCustomer() != null) {
            Customer customer = customerRepository.findById(contract.getCustomer().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + contract.getCustomer().getId()));
            contract.setCustomer(customer);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Customer information is invalid or missing");
        }

        if (drawingContract != null && !drawingContract.isEmpty()) {
            fileService.validateFile(drawingContract, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getFileName() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getFileName());
            }

            // Lưu tệp mới
            ex.setFileName(fileService.storeFile(drawingContract, folder));
        }

        ex.setStartDate(contract.getStartDate());
        ex.setEndDate(contract.getEndDate());
        ex.setLeaseStatus(contract.getLeaseStatus());
        ex.setCustomer(contract.getCustomer());
        ex.setOffice(contract.getOffice());

        ex.calculateTotal();
        BigDecimal newArea = ex.getTotalAmount();
        ex.setTotalAmount(newArea);

        return modelMapper.map(contractRepository.save(ex), ContractDto.class);
    }

    public void deleteContract(int id) throws URISyntaxException {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + id));

        List<Meter> meters = contract.getOffice().getMeters();
        if (meters != null && !meters.isEmpty()) {
            meterRepository.deleteAll(meters);
        }

        // Xóa tài liệu của khách hàng (CustomerDocument)
        if (contract.getCustomer() != null) {
            Customer customer = contract.getCustomer();
            if (customer.getCustomerDocuments() != null && !customer.getCustomerDocuments().isEmpty()) {
                CustomerTypeDocument customerTypeDoc = customer.getCustomerDocuments().get(0).getCustomerTypeDocument();
                if (customerTypeDoc != null && customerTypeDoc.getCustomerDocuments() != null) {
                    List<CustomerDocument> customerDocuments = customerTypeDoc.getCustomerDocuments();
                    if (!customerDocuments.isEmpty()) {
                        for (CustomerDocument customerDocument : customerDocuments) {
                            if (customerDocument.getFilePath() != null) {
                                fileService.deleteFile(baseURI + folder + "/" + customerDocument.getFilePath());
                            }
                        }
                        customerDocumentRepository.deleteAll(customerDocuments);
                    }
                }
            }
        }

        // Xóa tất cả HandoverStatus liên quan
        if (contract.getOffice() != null) {
            Office office = contract.getOffice();
            List<HandoverStatus> handoverStatuses = office.getHandoverStatuses();
            if (handoverStatuses != null && !handoverStatuses.isEmpty()) {
                for (HandoverStatus handover : handoverStatuses) {
                    if (handover.getDrawingFile() != null) {
                        fileService.deleteFile(baseURI + folder + "/" + handover.getDrawingFile());
                    }
                    if (handover.getEquipmentFile() != null) {
                        fileService.deleteFile(baseURI + folder + "/" + handover.getEquipmentFile());
                    }
                }
                handoverStatusRepository.deleteAll(handoverStatuses);
            }

            // Xóa tất cả hợp đồng liên quan
            List<Contract> contracts = office.getContracts();
            Set<Customer> customersToDelete = new HashSet<>();

            if (contracts != null && !contracts.isEmpty()) {
                for (Contract c : contracts) { // Sử dụng biến khác để tránh xung đột với biến contract chính
                    if (c.getFileName() != null) {
                        fileService.deleteFile(baseURI + folder + "/" + c.getFileName());
                    }

                    // Thêm Customer vào danh sách xóa nếu có
                    if (c.getCustomer() != null) {
                        customersToDelete.add(c.getCustomer());
                    }
                }
                contractRepository.deleteAll(contracts);
            }

            // Xóa tất cả Customer liên quan
            if (!customersToDelete.isEmpty()) {
                for (Customer customer : customersToDelete) {
                    if (customer.getUser() != null) {
                        userRepository.delete(customer.getUser());
                    }
                }
                customerRepository.deleteAll(customersToDelete);
            }

            if (!customersToDelete.isEmpty()) {
                for (Customer customer : customersToDelete) {
                    if (customer.getUser() != null) {
                        userRepository.delete(customer.getUser());
                    }
                }
                customerRepository.deleteAll(customersToDelete);
            }

            // Xóa bản vẽ của Office
            if (office.getDrawingFile() != null) {
                fileService.deleteFile(baseURI + folder + "/" + office.getDrawingFile());
            }

            // Xóa Office cuối cùng
            officeRepository.delete(office);
        }
    }

    // Check contract end date
//    public List<ContractDto> checkEndDateContract() {
//        // Lấy ngày hôm nay
//        LocalDate today = LocalDate.now();
//
//        // Lọc các hợp đồng có ngày kết thúc trong 1 tháng trước
//        List<ContractDto> contractsWithEndDateInNextMonth = contractRepository.findAll().stream()
//                .filter(contract -> contract.getEndDate() != null)
//                .filter(contract -> isEndDateWithinNextMonth(contract.getEndDate(), today))
//                .map(contract -> modelMapper.map(contract, ContractDto.class))
//                .collect(Collectors.toList());
//
//        return contractsWithEndDateInNextMonth;
//    }

    // Check time contract
//    private boolean isEndDateWithinNextMonth(LocalDate endDate, LocalDate today) {
//        // Tính toán ngày kết thúc trong 1 tháng nữa từ hôm nay
//        LocalDate oneMonthLater = today.plusMonths(1);
//
//        // Kiểm tra xem ngày kết thúc có nằm trong khoảng từ hôm nay đến 1 tháng sau không
//        return !endDate.isBefore(today) && !endDate.isAfter(oneMonthLater);
//    }
//
//    // Check birthday customer by contract
//    public List<ContractDto> checkCustomerBirthday() {
//        // Lấy ngày hôm nay
//        LocalDate today = LocalDate.now();
//
//        // Lấy ngày trong 3 ngày tới
//        LocalDate targetDate = today.plusDays(3);
//
//        // Lọc các hợp đồng có khách hàng có sinh nhật trong 3 ngày tới
//        List<ContractDto> contractsWithCustomerBirthdayInNextThreeDays = contractRepository.findAll().stream()
//                .filter(contract -> contract.getCustomer() != null && contract.getCustomer().getBirthday() != null) // Kiểm tra có customer và birthday
//                .filter(contract -> isCustomerBirthdayInNextThreeDays(contract.getCustomer(), today, targetDate)) // Kiểm tra sinh nhật trong 3 ngày tới
//                .map(contract -> modelMapper.map(contract, ContractDto.class))  // Chuyển đổi Contract thành ContractDto
//                .collect(Collectors.toList());
//
//        return contractsWithCustomerBirthdayInNextThreeDays;
//    }
//
//    private boolean isCustomerBirthdayInNextThreeDays(Customer customer, LocalDate today, LocalDate targetDate) {
//        LocalDate birthdayThisYear = customer.getBirthday().withYear(today.getYear());
//        System.out.println("birthday :  " + birthdayThisYear);
//        // Nếu sinh nhật đã qua trong năm nay, kiểm tra năm sau
//        if (birthdayThisYear.isBefore(today)) {
//            birthdayThisYear = birthdayThisYear.plusYears(1);
//        }
//
//        // Kiểm tra xem sinh nhật của khách hàng có trong 3 ngày tới không
//        return !birthdayThisYear.isBefore(today) && !birthdayThisYear.isAfter(targetDate);
//    }
//
//    /**
//     * Kiểm tra và nhắc nhở lịch hợp đồng dựa trên trạng thái của CustomerTypeDocument.
//     */
//
//    public List<ContractReminderDto> checkContractsByDocumentType() {
//        return contractRepository.findAll().stream()
//                // 1️⃣ Lọc hợp đồng có khách hàng hợp lệ
//                .filter(contract -> contract.getCustomer() != null && contract.getCustomer().getId() != null)
//
//                // 2️⃣ Lọc hợp đồng có CustomerType hợp lệ
//                .filter(contract -> contract.getCustomer().getCustomerType() != null
//                        && contract.getCustomer().getCustomerType().getId() != null)
//
//                // 3️⃣ Kiểm tra nếu hợp đồng thiếu tài liệu bắt buộc
//                .filter(contract -> isContractMissingRequiredDocuments(contract.getCustomer().getId()))
//
//                // 4️⃣ Chuyển đổi hợp đồng thành DTO nhắc nhở hợp đồng
//                .map(this::createContractReminderDto)
//
//                // 5️⃣ Thu thập kết quả thành danh sách
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * 🔹 Kiểm tra xem hợp đồng của khách hàng có thiếu tài liệu bắt buộc hay không.
//     */
//    private boolean isContractMissingRequiredDocuments(Integer customerId) {
//        // Lấy danh sách tài liệu bắt buộc theo loại khách hàng
//        Customer customer = customerRepository.findById(customerId)
//                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + customerId));
//
//        List<String> requiredDocuments = customerTypeDocumentService
//                .findByCustomerTypeAndStatus(customer.getCustomerType().getId(), true)
//                .stream()
//                .map(CustomerTypeDocument::getDocumentType)
//                .collect(Collectors.toList());
//
//        // Lấy danh sách tài liệu khách hàng đã nộp
//        List<String> providedDocuments = customerDocumentRepository.findByCustomerId(customerId)
//                .stream()
//                .filter(CustomerDocument::isApproved) // Chỉ lấy tài liệu đã duyệt
//                .map(document -> document.getCustomerTypeDocument().getDocumentType())
//                .collect(Collectors.toList());
//
//        // Kiểm tra nếu khách hàng còn thiếu tài liệu bắt buộc
//        return requiredDocuments.stream()
//                .anyMatch(doc -> !providedDocuments.contains(doc)); // ✅ Trả về true nếu có tài liệu thiếu
//    }
//
//    /**
//     * 🔹 Tạo DTO nhắc nhở hợp đồng.
//     */
//    private ContractReminderDto createContractReminderDto(Contract contract) {
//        ModelMapper modelMapper = new ModelMapper();
//
//        // Chuyển đổi hợp đồng thành DTO
//        ContractReminderDto reminderDto = modelMapper.map(contract, ContractReminderDto.class);
//
//        // ✅ Thêm danh sách tài liệu còn thiếu vào DTO
//        List<CustomerTypeDocumentDto> missingDocuments = getMissingDocuments(contract.getCustomer().getId());
//        reminderDto.setCustomerTypeDocuments(missingDocuments);
//
//        return reminderDto;
//    }
//
//    /**
//     * 🔹 Lấy danh sách tài liệu còn thiếu của khách hàng.
//     */
//    public List<CustomerTypeDocumentDto> getMissingDocuments(Integer customerId) {
//        Customer customer = customerRepository.findById(customerId)
//                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + customerId));
//
//        List<CustomerTypeDocument> requiredDocuments = customerTypeDocumentService
//                .findByCustomerTypeAndStatus(customer.getCustomerType().getId(), true); // Lấy danh sách tài liệu bắt buộc
//
//        List<CustomerTypeDocument> providedDocuments = customerDocumentRepository.findByCustomerId(customerId)
//                .stream()
//                .filter(CustomerDocument::isApproved) // Chỉ lấy tài liệu đã duyệt
//                .map(CustomerDocument::getCustomerTypeDocument) // Lấy CustomerTypeDocument
//                .collect(Collectors.toList());
//
//        // ✅ Trả về danh sách tài liệu còn thiếu dưới dạng DTO đầy đủ
//        return requiredDocuments.stream()
//                .filter(doc -> !providedDocuments.contains(doc)) // Kiểm tra xem tài liệu nào còn thiếu
//                .map(doc -> new CustomerTypeDocumentDto(
//                        doc.getId(),
//                        doc.getDocumentType(),
//                        doc.isStatus(),
//
//                        doc.getCreatedAt(),
//                        doc.getCreatedBy(),
//                        doc.getUpdatedAt(),
//                        doc.getUpdatedBy()
//                ))
//                .collect(Collectors.toList());
//    }
}
