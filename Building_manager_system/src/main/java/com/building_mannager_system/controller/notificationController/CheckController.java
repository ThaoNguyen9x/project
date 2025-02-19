package com.building_mannager_system.controller.notificationController;


import com.building_mannager_system.dto.requestDto.ContractDto.ContractDto;
import com.building_mannager_system.dto.responseDto.ApiResponce;
import com.building_mannager_system.dto.responseDto.ContractReminderDto;
import com.building_mannager_system.service.customer_service.ContractService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/check")
public class CheckController {

    @Autowired
    private ContractService contractService;

//
//    // Endpoint để kiểm tra sinh nhật khách hàng
//    @GetMapping("/birthday")
//    public ApiResponce<List<ContractDto>> checkCustomerBirthday() {
//        List<ContractDto> result = contractService.checkCustomerBirthday();
//        return new ApiResponce<>(200, result, "success");  // Trả về ApiResponse với code 200, dữ liệu và trạng thái "success"
//    }
//
//    // Endpoint để kiểm tra ngày kết thúc hợp đồng trong 1 tháng
//    @GetMapping("/enddate")
//    public ApiResponce<List<ContractDto>> checkEndDateContract() {
//        List<ContractDto> result = contractService.checkEndDateContract();
//        return new ApiResponce<>(200, result, "success");  // Trả về ApiResponse với code 200, dữ liệu và trạng thái "success"
//    }

    // Endpoint để kiểm tra các hợp đồng và tài liệu không hoạt động (unactive)
//    @GetMapping("/inactive")
//    public ApiResponce<List<ContractReminderDto>> checkInactiveContractsAndDocuments() {
//        List<ContractReminderDto> result = contractService.checkContractsByDocumentType();
//        return new ApiResponce<>(200, result, "success");  // Trả về ApiResponse với code 200, dữ liệu và trạng thái "success"
//    }
//    @GetMapping ("/check-contract-end-date")
//    public ApiResponce<List<ContractDto>> checkContractEndDate() {
//        List<ContractDto> list = contractService.checkEndDateContract();
//        return new ApiResponce<>(200, list, "success");
//    }
}
