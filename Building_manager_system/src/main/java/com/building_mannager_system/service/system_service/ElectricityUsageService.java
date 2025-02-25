package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.notificationDto.NotificationMaintenanceDto;
import com.building_mannager_system.dto.requestDto.propertyDto.ElectricityUsageDTO;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.system_manger.ElectricityUsage;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.building_mannager_system.entity.notification.Notification;
import com.building_mannager_system.entity.notification.NotificationMaintenance;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.entity.verification.ElectricityUsageVerification;
import com.building_mannager_system.enums.Status;
import com.building_mannager_system.enums.StatusNotifi;
import com.building_mannager_system.repository.Contract.ContractRepository;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.notification.NotificationRepository;
import com.building_mannager_system.repository.notification.RecipientRepository;
import com.building_mannager_system.repository.system_manager.ElectricityUsageRepository;
import com.building_mannager_system.repository.system_manager.MeterRepository;
import com.building_mannager_system.repository.verificationRepository.ElectricityUsageVerificationRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.service.notification.NotificationPaymentContractService;
import com.building_mannager_system.service.notification.RecipientService;
import com.building_mannager_system.service.verification_service.ElectricityUsageVerificationService;
import com.building_mannager_system.service.websocket.WebsocketService;
import com.building_mannager_system.untils.JsonUntils;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ElectricityUsageService {

    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final CustomerRepository customerRepository;
    private final RecipientService recipientService;
    private final NotificationRepository notificationRepository;
    private final WebsocketService websocketService;
    private final RecipientRepository recipientRepository;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "electricity-usages";
    List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx", "webp");

    private final ElectricityUsageRepository electricityUsageRepository;
    private final ModelMapper modelMapper;
    private final MeterRepository meterRepository;
    private final FileService fileService;
    private final ElectricityCostService electricityCostService;
    private final ElectricityUsageVerificationService electricityUsageVerificationService;
    private final SomeFilterByMeterIdService someFilterByMeterIdService;
    private final NotificationPaymentContractService notificationPaymentContractService;
    private final ElectricityUsageVerificationRepository electricityUsageVerificationRepository;

    public ElectricityUsageService(ElectricityUsageRepository electricityUsageRepository,
                                   ModelMapper modelMapper,
                                   MeterRepository meterRepository,
                                   FileService fileService,
                                   ElectricityCostService electricityCostService,
                                   ElectricityUsageVerificationService electricityUsageVerificationService,
                                   SomeFilterByMeterIdService someFilterByMeterIdService,
                                   NotificationPaymentContractService notificationPaymentContractService, ElectricityUsageVerificationRepository electricityUsageVerificationRepository, UserRepository userRepository, ContractRepository contractRepository, CustomerRepository customerRepository, RecipientService recipientService, NotificationRepository notificationRepository, WebsocketService websocketService, RecipientRepository recipientRepository) {
        this.electricityUsageRepository = electricityUsageRepository;
        this.modelMapper = modelMapper;
        this.meterRepository = meterRepository;
        this.fileService = fileService;
        this.electricityCostService = electricityCostService;
        this.electricityUsageVerificationService = electricityUsageVerificationService;
        this.someFilterByMeterIdService = someFilterByMeterIdService;
        this.notificationPaymentContractService = notificationPaymentContractService;
        this.electricityUsageVerificationRepository = electricityUsageVerificationRepository;
        this.userRepository = userRepository;
        this.contractRepository = contractRepository;
        this.customerRepository = customerRepository;
        this.recipientService = recipientService;
        this.notificationRepository = notificationRepository;
        this.websocketService = websocketService;
        this.recipientRepository = recipientRepository;
    }

    public ResultPaginationDTO getAllElectricityUsages(Specification<ElectricityUsage> spec, Pageable pageable) {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");

        User user = userRepository.findByEmail(email);
        if (user == null) throw new APIException(HttpStatus.NOT_FOUND, "User not found");

        if (user.getRole().getName().equals("Customer")) {
            Customer customer = user.getCustomer();
            if (customer == null) throw new APIException(HttpStatus.NOT_FOUND, "Customer not found");

            Contract contract = customer.getContracts().stream()
                    .findFirst()
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found"));

            Meter meter = contract.getOffice() != null && !contract.getOffice().getMeters().isEmpty()
                    ? contract.getOffice().getMeters().get(0)
                    : null;

            if (meter != null) {
                spec = Specification.where((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("meter"), meter));
            } else {
                throw new APIException(HttpStatus.NOT_FOUND, "No meter found for this customer");
            }
        }

        Page<ElectricityUsage> page = electricityUsageRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);

        List<ElectricityUsageDTO> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ElectricityUsageDTO.class))
                .collect(Collectors.toList());

        rs.setResult(list);
        return rs;
    }

    public ElectricityUsageDTO createElectricityUsage(MultipartFile image, ElectricityUsage electricityUsage) {

        // Check Meter
        if (electricityUsage.getMeter() != null) {
            Meter meter = meterRepository.findById(electricityUsage.getMeter().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Meter not found with ID: " + electricityUsage.getMeter().getId()));
            electricityUsage.setMeter(meter);
        }

        // Validate and store the file
        fileService.validateFile(image, allowedExtensions);
        electricityUsage.setImageName(fileService.storeFile(image, folder));
        electricityUsage.setElectricityRate(BigDecimal.valueOf(1.2));
        electricityUsage.setElectricityCost(BigDecimal.valueOf(1.6));
        electricityUsage.setEndReading(electricityUsage.getEndReading());
        electricityUsage.setReadingDate(LocalDate.now());

        // Lấy ngày hiện tại
        LocalDate currentDate = LocalDate.now();
        LocalDate lastMonth20th = currentDate.minusMonths(1).withDayOfMonth(20);

        // Gọi phương thức để lấy danh sách sử dụng điện theo MeterId và khoảng thời gian
        List<ElectricityUsage> lastMonthUsage = getElectricityUsageByMeterAndDate(electricityUsage.getMeter().getId());

        // Debugging - kiểm tra danh sách dữ liệu tháng trước
        System.out.println("Dữ liệu tháng trước: " + lastMonthUsage);

        if (lastMonthUsage != null && !lastMonthUsage.isEmpty()) {
            // Nếu có dữ liệu tháng trước, lấy chỉ số điện cuối kỳ từ bản ghi cuối cùng
            BigDecimal lastMonthEndReading = lastMonthUsage.get(lastMonthUsage.size() - 1).getEndReading();
            BigDecimal startReading = lastMonthEndReading != null ? lastMonthEndReading : BigDecimal.ZERO;
            electricityUsage.setStartReading(startReading);
            //set theo ngày hiện tại ghi
            // dto.setReadingDate(currentDate);

            // Tính toán lượng điện sử dụng
            BigDecimal usageAmount = electricityUsage.getEndReading().subtract(startReading);
            electricityUsage.setUsageAmount(usageAmount);
        } else {
            // Nếu không có dữ liệu tháng trước (lần ghi đầu tiên)
            electricityUsage.setStartReading(BigDecimal.ZERO);

            // Tính toán lượng điện sử dụng nếu có giá trị endReading
            if (electricityUsage.getEndReading() != null) {
                electricityUsage.setUsageAmount(electricityUsage.getEndReading()); // Sử dụng endReading làm lượng sử dụng
            }
        }
        // Tính toán tiền điện
        BigDecimal usageAmount = electricityUsage.getUsageAmount() != null ? electricityUsage.getUsageAmount() : BigDecimal.ZERO;
        BigDecimal totalCost = electricityCostService.calculateCost(usageAmount);
        electricityUsage.setElectricityCost(totalCost);

        // Chuyển DTO sang Entity
        //set ngày ghi theo ngày hiện tại
        // dto.setReadingDate(currentDate);
        ElectricityUsage entity = modelMapper.map(electricityUsage, ElectricityUsage.class);

        // Lưu bản ghi mới vào cơ sở dữ liệu
        ElectricityUsage savedEntity = electricityUsageRepository.save(entity);

        // Debugging - kiểm tra entity đã lưu
        System.out.println("Entity đã lưu: " + savedEntity);
        // Tạo thông báo cho khách hàng xác nhận chỉ số điện
        createElectricityUsageVerification(savedEntity);
        // Chuyển entity đã lưu trở lại DTO và trả về
        return modelMapper.map(savedEntity, ElectricityUsageDTO.class);
    }

    public ElectricityUsageDTO getElectricityUsage(int id) {
        ElectricityUsage electricityUsage = electricityUsageRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity usage not found with ID: " + id));

        LocalDate currentReadingDate = electricityUsage.getReadingDate();
        LocalDate lastMonthStart = currentReadingDate.minusMonths(1).withDayOfMonth(1);
        LocalDate lastMonthEnd = currentReadingDate.minusMonths(1).withDayOfMonth(currentReadingDate.minusMonths(1).lengthOfMonth());

        List<ElectricityUsage> lastMonthUsageList = electricityUsageRepository.findByMeterIdAndReadingDateBetween(
                electricityUsage.getMeter().getId(), lastMonthStart, lastMonthEnd);

        ElectricityUsage previousMonthUsage = null;
        if (!lastMonthUsageList.isEmpty()) {
            previousMonthUsage = lastMonthUsageList.get(lastMonthUsageList.size() - 1); // Lấy bản ghi cuối của tháng trước
        }

        ElectricityUsageDTO dto = modelMapper.map(electricityUsage, ElectricityUsageDTO.class);

        if (previousMonthUsage != null) {
            dto.setPreviousMonthElectricityCost(previousMonthUsage.getElectricityCost());
            dto.setPreviousMonthUsageAmount(previousMonthUsage.getUsageAmount());
            dto.setPreviousMonthReadingDate(previousMonthUsage.getReadingDate());
        } else {
            dto.setPreviousMonthElectricityCost(BigDecimal.ZERO);
            dto.setPreviousMonthUsageAmount(BigDecimal.ZERO);
            dto.setPreviousMonthReadingDate(null);
        }

        return dto;
    }

    public ElectricityUsageDTO updateStatus(int id, ElectricityUsage electricityUsage) {
        ElectricityUsage ex = electricityUsageRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity usage not found with ID: " + id));

        ex.setStatus(electricityUsage.getStatus());
        electricityUsageRepository.saveAndFlush(ex);

        List<String> roles = List.of("Application_Admin");
        List<User> recipients = userRepository.findByRole_NameIn(roles);

        if (recipients.isEmpty()) return null;

        String message;
        try {
            message = JsonUntils.toJson(electricityUsage);

            System.out.println("Electricity Usage Data: " + JsonUntils.toJson(electricityUsage));
        } catch (Exception e) {
            throw new APIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error serializing notification message", e);
        }

        for (User recipientUser : recipients) {
            List<Recipient> existingRecipients = recipientRepository.findByReferenceId(recipientUser.getId());

            if (existingRecipients == null || existingRecipients.isEmpty()) {
                Recipient rec = new Recipient();
                rec.setType("Electricity_Usage_Customer");
                rec.setName("Send Electricity Usage");
                rec.setReferenceId(recipientUser.getId());
                existingRecipients.add(recipientService.createRecipient(rec));
            }

            Recipient existingRecipient = existingRecipients.get(0);

            Notification notification = new Notification();
            notification.setRecipient(existingRecipient);
            notification.setMessage(message);
            notification.setStatus(StatusNotifi.PENDING);
            notification.setCreatedAt(LocalDateTime.now());

            notificationRepository.save(notification);

            try {
                websocketService.sendNotificationToRecipients(recipientUser.getId(), electricityUsage);
            } catch (Exception e) {
                System.err.println("Error sending WebSocket notification for user ID: " + recipientUser.getId() + ", " + e.getMessage());
            }
        }

        return modelMapper.map(electricityUsage, ElectricityUsageDTO.class);
    }

    public List<ElectricityUsage> getElectricityUsageByMeterAndDate(int MeterID) {

        LocalDate currentDate = LocalDate.now();

        LocalDate firstDayLastMonth = currentDate.minusMonths(1).withDayOfMonth(1);
        LocalDate lastDayLastMonth = currentDate.minusMonths(1).withDayOfMonth(currentDate.minusMonths(1).lengthOfMonth());

        return electricityUsageRepository.findByMeterIdAndReadingDateBetween(
                MeterID,
                firstDayLastMonth,
                lastDayLastMonth
        );
    }

    public ElectricityUsageDTO updateElectricityUsage(int id, MultipartFile image, ElectricityUsage electricityUsage) throws URISyntaxException {
        ElectricityUsage ex = electricityUsageRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity usage not found with ID: " + id));

        // Validate and Assign Meter
        if (electricityUsage.getMeter() != null) {
            Meter meter = meterRepository.findById(electricityUsage.getMeter().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Meter not found with ID: " + electricityUsage.getMeter().getId()));
            ex.setMeter(meter);
        } else {
            throw new APIException(HttpStatus.BAD_REQUEST, "Meter information is invalid or missing");
        }

        // Handle Image Upload
        if (image != null && !image.isEmpty()) {
            fileService.validateFile(image, allowedExtensions);
            if (ex.getImageName() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getImageName());
            }
            ex.setImageName(fileService.storeFile(image, folder));
        }

        // Assign Fixed Electricity Rate & Cost
        ex.setElectricityRate(BigDecimal.valueOf(1.2));

        // Fetch Last Month's Electricity Usage
        List<ElectricityUsage> lastMonthUsage = getElectricityUsageByMeterAndDate(ex.getMeter().getId());
        BigDecimal previousEndReading = BigDecimal.ZERO;

        if (!lastMonthUsage.isEmpty()) {
            ElectricityUsage lastMonthRecord = lastMonthUsage.get(lastMonthUsage.size() - 1);
            previousEndReading = lastMonthRecord.getEndReading();
        }

        // Ensure Start Reading is Set
        BigDecimal startReading = previousEndReading != null ? previousEndReading : BigDecimal.ZERO;
        ex.setStartReading(startReading);

        // Ensure End Reading is Set
        if (electricityUsage.getEndReading() != null) {
            ex.setEndReading(electricityUsage.getEndReading());
        }

        // Calculate Usage Amount
        BigDecimal usageAmount = ex.getEndReading().subtract(startReading);
        ex.setUsageAmount(usageAmount != null ? usageAmount : BigDecimal.ZERO);

        // Calculate Total Cost
        BigDecimal totalCost = electricityCostService.calculateCost(ex.getUsageAmount());
        ex.setElectricityCost(totalCost);

        // Update Additional Fields
        ex.setReadingDate(electricityUsage.getReadingDate());
        ex.setComments(electricityUsage.getComments());

        // Save Updated Record
        ElectricityUsage savedEntity = electricityUsageRepository.save(ex);

        createElectricityUsageVerification(savedEntity);

        // Return Updated DTO
        return modelMapper.map(savedEntity, ElectricityUsageDTO.class);
    }

    public void deleteElectricityUsage(int id) throws URISyntaxException {
        ElectricityUsage ex = electricityUsageRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity usage not found with ID: " + id));

        if (ex.getImageName() != null) {
            fileService.deleteFile(baseURI + folder + "/" + ex.getImageName());
        }

        electricityUsageRepository.delete(ex);
    }

    private void createElectricityUsageVerification(ElectricityUsage electricityUsage) {
        // Lấy dữ liệu tháng trước
        List<ElectricityUsage> lastMonthUsage = electricityUsageRepository.findByMeterIdAndReadingDateBetween(
                electricityUsage.getMeter().getId(),
                electricityUsage.getReadingDate().minusMonths(1).withDayOfMonth(1),
                electricityUsage.getReadingDate().minusMonths(1).withDayOfMonth(electricityUsage.getReadingDate().minusMonths(1).lengthOfMonth())
        );

        // Biến để lưu thông tin của tháng trước
        BigDecimal previousEndReading = BigDecimal.ZERO;
        BigDecimal previousMonthUsage = BigDecimal.ZERO;
        BigDecimal previousMonthCost = BigDecimal.ZERO;
        String previousMonthImageName = null;

        if (!lastMonthUsage.isEmpty()) {
            // Lấy bản ghi cuối cùng của tháng trước
            ElectricityUsage lastMonthRecord = lastMonthUsage.get(lastMonthUsage.size() - 1);
            previousEndReading = lastMonthRecord.getEndReading();
            previousMonthCost = lastMonthRecord.getElectricityCost();  // Sử dụng giá trị chi phí tháng trước
            previousMonthImageName = lastMonthRecord.getImageName();
            previousMonthUsage = lastMonthRecord.getUsageAmount();
            // Hình ảnh tháng trước
        }

        ElectricityUsageVerification verification = new ElectricityUsageVerification();

        verification.setElectricityId(electricityUsage.getId()); // Gán ID của ElectricityUsage
        verification.setMeter(electricityUsage.getMeter());
        verification.setStartReading(previousEndReading);
        verification.setEndReading(electricityUsage.getEndReading());
        verification.setReadingDate(electricityUsage.getReadingDate()); // Chỉ số cuối kỳ của tháng hiện tại
        verification.setUsageAmountCurrentMonth(electricityUsage.getUsageAmount());
        verification.setUsageAmountPreviousMonth(previousMonthUsage);
        verification.setStatus(Status.UNACTIV); // Trạng thái chờ xác nhận
        verification.setCurrentMonthCost(electricityUsage.getElectricityCost());
        verification.setPreviousMonthCost(previousMonthCost);
        verification.setImageName(electricityUsage.getImageName()); // Ảnh của tháng hiện tại
        verification.setPreviousMonthImageName(previousMonthImageName); // Ảnh của tháng trước

        ElectricityUsageVerification save = electricityUsageVerificationRepository.save(verification);

        Integer contacId = someFilterByMeterIdService.getContactIdFromMeterId(electricityUsage.getMeter().getId());
        notificationPaymentContractService.sendElectricityUsageVerificationNotification(contacId, save);
    }

//    public ResultPaginationDTO getHistoryElectricityUsagesByMeterId(
//            Specification<ElectricityUsage> spec, Pageable pageable, int meterId) {
//
//        // Sắp xếp theo readingDate (nếu cần)
//        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("readingDate").descending());
//
//        // Truy vấn danh sách sử dụng điện theo meterId với phân trang
//        Page<ElectricityUsage> electricityUsagePage = electricityUsageRepository.findByMeterId(meterId, pageable);
//
//        // Kiểm tra nếu danh sách rỗng, trả về một DTO rỗng
//        if (electricityUsagePage.isEmpty()) {
//            ResultPaginationDTO rs = new ResultPaginationDTO();
//            ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
//            meta.setPage(0);
//            meta.setPageSize(pageable.getPageSize());
//            meta.setPages(0);
//            meta.setTotal(0L);
//            rs.setMeta(meta);
//            rs.setResult(Collections.emptyList());
//            return rs;
//        }
//
//        // Chuyển đổi từ Page<Entity> sang List<DTO> bằng ModelMapper
//        List<ElectricityUsageDTO> dtoList = electricityUsagePage.getContent().stream()
//                .map(entity -> modelMapper.map(entity, ElectricityUsageDTO.class))
//                .collect(Collectors.toList());
//
//        // Tạo đối tượng kết quả
//        ResultPaginationDTO rs = new ResultPaginationDTO();
//
//        // Tạo metadata cho phân trang
//        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
//        mt.setPage(pageable.getPageNumber() + 1);
//        mt.setPageSize(pageable.getPageSize());
//        mt.setPages(electricityUsagePage.getTotalPages());
//        mt.setTotal(electricityUsagePage.getTotalElements());
//
//        rs.setMeta(mt); // Gán metadata vào DTO
//        rs.setResult(dtoList); // Gán danh sách DTO vào DTO
//
//        return rs;
//    }
}




