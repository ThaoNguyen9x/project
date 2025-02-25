package com.building_mannager_system.controller.work_registration;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.dto.requestDto.work_registration.WorkRegistrationDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.work_registration.WorkRegistration;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.service.notification.NotificationPaymentContractService;
import com.building_mannager_system.service.work_registration.WorkRegistrationService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/work-registrations")
public class WorkRegistrationController {

    private final WorkRegistrationService workRegistrationService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final NotificationPaymentContractService notificationPaymentContractService;

    public WorkRegistrationController(WorkRegistrationService workRegistrationService,
                                      SimpMessagingTemplate messagingTemplate,
                                      UserRepository userRepository, NotificationPaymentContractService notificationPaymentContractService) {
        this.workRegistrationService = workRegistrationService;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.notificationPaymentContractService = notificationPaymentContractService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách đăng ký công việc thành công")
    public ResponseEntity<ResultPaginationDTO> getAllWorkRegistrations(@Filter Specification<WorkRegistration> spec,
                                                                       Pageable pageable) {
        return ResponseEntity.ok(workRegistrationService.getAllWorkRegistrations(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo đăng ký công việc thành công")
    public ResponseEntity<WorkRegistrationDto> createWorkRegistration(@RequestPart(value = "image", required = false) MultipartFile image,
                                                                      @ModelAttribute WorkRegistration workRegistration) {
        return new ResponseEntity<>(workRegistrationService.createWorkRegistration(image, workRegistration), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy đăng ký công việc thành công")
    public ResponseEntity<WorkRegistrationDto> getWorkRegistration(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(workRegistrationService.getWorkRegistration(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật đăng ký công việc thành công")
    public ResponseEntity<WorkRegistrationDto> updateWorkRegistration(@PathVariable(name = "id") int id,
                                                                      @RequestPart(value = "image", required = false) MultipartFile image,
                                                                      @RequestBody WorkRegistration workRegistration) throws URISyntaxException {
        WorkRegistrationDto res = workRegistrationService.updateWorkRegistration(id, image, workRegistration);
        notificationPaymentContractService.sendWorkRegistrationToCustomer(res);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa đăng ký công việc thành công")
    public ResponseEntity<Void> deleteWorkRegistration(@PathVariable(name = "id") int id) throws URISyntaxException {
        workRegistrationService.deleteWorkRegistration(id);
        return ResponseEntity.ok(null);
    }
}
