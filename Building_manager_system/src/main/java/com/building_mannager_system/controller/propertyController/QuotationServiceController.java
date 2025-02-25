package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.QuotationDto;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.entity.property_manager.Quotation;
import com.building_mannager_system.service.notification.NotificationPaymentContractService;
import com.building_mannager_system.service.system_service.QuotationService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/quotations")
public class QuotationServiceController {

    private final QuotationService quotationService;
    private final NotificationPaymentContractService notificationPaymentContractService;

    public QuotationServiceController(QuotationService quotationService, NotificationPaymentContractService notificationPaymentContractService) {
        this.quotationService = quotationService;
        this.notificationPaymentContractService = notificationPaymentContractService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách báo giá thành công")
    public ResponseEntity<ResultPaginationDTO> getAllQuotations(@Filter Specification<Quotation> spec,
                                                             Pageable pageable) {
        return ResponseEntity.ok(quotationService.getAllQuotations(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo báo giá thành công")
    public ResponseEntity<QuotationDto> createQuotation(@RequestPart(value = "image", required = false) MultipartFile file,
                                                        @ModelAttribute Quotation quotation) {
        return new ResponseEntity<>(quotationService.createQuotation(file, quotation), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy báo giá thành công")
    public ResponseEntity<QuotationDto> getQuotation(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(quotationService.getQuotation(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật báo giá thành công")
    public ResponseEntity<QuotationDto> updateQuotation(@PathVariable(name = "id") Long id,
                                                   @RequestPart(value = "image", required = false) MultipartFile file,
                                                   @ModelAttribute Quotation quotation) throws URISyntaxException {
        QuotationDto res = quotationService.updateQuotation(id, file, quotation);
        notificationPaymentContractService.sendRepairProposal(res);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa báo giá thành công")
    public ResponseEntity<Void> deleteQuotation(@PathVariable(name = "id") Long id) throws URISyntaxException {
        quotationService.deleteQuotation(id);
        return ResponseEntity.ok(null);
    }
}
