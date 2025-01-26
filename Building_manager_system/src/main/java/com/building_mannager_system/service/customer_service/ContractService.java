package com.building_mannager_system.service.customer_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.ContractDto.ContractDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.repository.Contract.ContractRepository;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.office.OfficeRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.utils.exception.APIException;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContractService {
    private final UserRepository userRepository;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "contracts";

    private final OfficeRepository officeRepository;
    private final CustomerRepository customerRepository;
    private final ContractRepository contractRepository;
    private final FileService fileService;
    private final ModelMapper modelMapper;

    public ContractService(ContractRepository contractRepository,
                           ModelMapper modelMapper,
                           OfficeRepository officeRepository,
                           CustomerRepository customerRepository, FileService fileService, UserRepository userRepository) {
        this.contractRepository = contractRepository;
        this.modelMapper = modelMapper;
        this.officeRepository = officeRepository;
        this.customerRepository = customerRepository;
        this.fileService = fileService;
        this.userRepository = userRepository;
    }

    public ResultPaginationDTO getAllContracts(Specification<Contract> spec, Pageable pageable) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        if (user.getRole().getName().equals("USER")) {
            // Adjust the specification to filter contracts based on the user's ID in the associated Customer
            spec = spec.and((root, query, builder) ->
                    builder.equal(root.get("customer").get("user").get("id"), user.getId())
            );
        }

        // Fetch the contracts with the adjusted specification
        Page<Contract> page = contractRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);

        // Map the result to ContractDto and return it
        List<ContractDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ContractDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);
        return rs;
    }

    public ContractDto createContract(MultipartFile drawing, Contract contract) {
        // Check office
        if (contract.getOffice() != null) {
            Office office = officeRepository.findById(contract.getOffice().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + contract.getOffice().getId()));
            contract.setOffice(office);

            BigDecimal totalAmount = office.getArea()
                    .multiply(office.getRentPrice())
                    .multiply(office.getServiceFee())
                    .multiply(BigDecimal.valueOf(ChronoUnit.MONTHS.between(contract.getStartDate(), contract.getEndDate())));

            contract.setTotalAmount(totalAmount);

            System.out.println("Office Area: " + office.getArea());
            System.out.println("Rent Price: " + office.getRentPrice());
            System.out.println("Service Fee: " + office.getServiceFee());
            System.out.println("Start Date: " + contract.getStartDate());
            System.out.println("End Date: " + contract.getEndDate());
            System.out.println("Months Between: " + ChronoUnit.MONTHS.between(contract.getStartDate(), contract.getEndDate()));
            System.out.println("Total Amount Calculation: " + totalAmount);
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

        List<String> allowedExtensions = Arrays.asList("pdf");
        fileService.validateFile(drawing, allowedExtensions);
        contract.setFileName(fileService.storeFile(drawing, folder));

        return modelMapper.map(contractRepository.save(contract), ContractDto.class);
    }

    public ContractDto getContract(int id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + id));

        return modelMapper.map(contract, ContractDto.class);
    }

    public ContractDto updateContract(int id, MultipartFile drawing, Contract contract) throws URISyntaxException {
        Contract ex = contractRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + id));

        // Check office
        if (contract.getOffice() != null) {
            Office office = officeRepository.findById(contract.getOffice().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + contract.getOffice().getId()));
            contract.setOffice(office);

            BigDecimal totalAmount = office.getArea()
                    .multiply(office.getRentPrice())
                    .multiply(office.getServiceFee())
                    .multiply(BigDecimal.valueOf(ChronoUnit.MONTHS.between(contract.getStartDate(), contract.getEndDate())));

            contract.setTotalAmount(totalAmount);
        }

        // Check customer
        if (contract.getCustomer() != null) {
            Customer customer = customerRepository.findById(contract.getCustomer().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + contract.getCustomer().getId()));
            contract.setCustomer(customer);
        }

        List<String> allowedExtensions = Arrays.asList("pdf");
        if (drawing != null && !drawing.isEmpty()) {
            fileService.validateFile(drawing, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getFileName() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getFileName());
            }

            // Lưu tệp mới
            ex.setFileName(fileService.storeFile(drawing, folder));
        }

        ex.setStartDate(contract.getStartDate());
        ex.setEndDate(contract.getEndDate());
        ex.setLeaseStatus(contract.getLeaseStatus());
        ex.setTotalAmount(contract.getTotalAmount());
        ex.setOffice(contract.getOffice());
        ex.setCustomer(contract.getCustomer());

        return modelMapper.map(contractRepository.save(ex), ContractDto.class);
    }

    public void deleteContract(int id) throws URISyntaxException {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + id));

        try {
            if (contract.getFileName() != null) {
                fileService.deleteFile(baseURI + folder + "/" + contract.getFileName());
            }

            contractRepository.delete(contract);
        } catch (DataIntegrityViolationException e) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Đang hoạt động không thể xóa");
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
//
//    // Check time contract
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

//    /**
//     * Kiểm tra và nhắc nhở lịch hợp đồng dựa trên trạng thái của CustomerTypeDocument.
//     */
//    public List<ContractReminderDto> checkInactiveContractsAndDocuments() {
//        return contractRepository.findAll().stream()
//                // Lọc hợp đồng có customer hợp lệ
//                .filter(contract -> contract.getCustomer() != null
//                        && contract.getCustomer().getId() != null)
//
//                // Lọc hợp đồng có customerType hợp lệ
//                .filter(contract -> contract.getCustomer().getCustomerType() != null
//                        && contract.getCustomer().getCustomerType().getId() != null)
//
//                // Kiểm tra các tài liệu liên quan có trạng thái "unactive"
//                .filter(contract -> hasUnactiveDocuments(contract.getCustomer().getCustomerType()))
//
//                // Chuyển đổi hợp đồng và tài liệu thành DTO để nhắc nhở
//                .map(contract -> createContractReminderDto(contract))
//
//                // Thu thập kết quả thành danh sách
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Kiểm tra xem CustomerType có tài liệu nào "unactive" không.
//     */
//    private boolean hasUnactiveDocuments(CustomerType customerType) {
//        // Gọi service để lấy danh sách tài liệu với trạng thái "unactive"
//        List<CustomerTypeDocumentDto> unactiveDocuments = customerTypeDocumentService
//                .findByCustomerTypeAndStatus(customerType.getId(), false); // false = "unactive"
//
//        return !unactiveDocuments.isEmpty(); // Trả về true nếu có tài liệu "unactive"
//    }
//
//    /**
//     * Tạo DTO nhắc nhở hợp đồng.
//     */
//    private ContractReminderDto createContractReminderDto(Contract contract) {
//        ContractReminderDto reminderDto = new ContractReminderDto();
//        reminderDto.setContract(contractMapper.toDto(contract)); // Thông tin hợp đồng
//        reminderDto.setCustomerTypeDocuments(
//                customerTypeDocumentService.findByCustomerTypeAndStatus(
//                        contract.getCustomerID().getCustomerType().getId(), false)); // Tài liệu "unactive"
//        return reminderDto;
//    }
//
//    // Filter contract by ID with additional filtering logic
//    public Contract filterContractById(Integer contractId) {
//        // Retrieve the contract using the contractId
//        System.out.println(contractId);
//        Contract contract = contractRepository.findById(contractId)
//                .orElseThrow(() -> new IllegalArgumentException("Contract not found with ID: " + contractId));
//
////        // Apply additional filters or conditions if needed
////        if (contract.getStartDate().isAfter(LocalDate.now())) {
////            throw new IllegalArgumentException("Contract start date is in the future.");
////        }
////
////        if (contract.getEndDate().isBefore(LocalDate.now())) {
////            throw new IllegalArgumentException("Contract has already ended.");
////        }
////
////        // If you need more specific filtering (e.g., customer status or contract type), apply here
////        if (contract.getCustomerID() == null || contract.getCustomerID().getStatus() != "Active") {
////            throw new IllegalArgumentException("Customer is not active for contract ID: " + contractId);
////        }
//
//        // Return the filtered contract
//        return contract;
//    }
//
//
//    // Phương thức để lấy Contract từ OfficeId
//    public Contract getContractByOfficeId(Integer officeId) {
//        // Tìm hợp đồng từ OfficeId
//        Contract contract = contractRepository.findByOfficeID_Id(officeId);
//        if (contract == null) {
//            throw new RuntimeException("No contracts found for OfficeId: " + officeId);
//        }
//
//
//        return contract;
//    }
}
