package com.building_mannager_system.controller.contractController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.ContractDto.ConfirmationRequestDto;
import com.building_mannager_system.dto.requestDto.ContractDto.ContractDto;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.service.customer_service.ContractService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {
    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách hợp đồng thành công")
    public ResponseEntity<ResultPaginationDTO> getAllContracts(@Filter Specification<Contract> spec,
                                                               Pageable pageable) {
        return ResponseEntity.ok(contractService.getAllContracts(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo hợp đồng thành công")
    public ResponseEntity<ContractDto> createContract(@RequestPart(value = "drawingContract", required = false) MultipartFile drawingContract,
                                                      @ModelAttribute Contract contract) {
        return new ResponseEntity<>(contractService.createContract(drawingContract, contract), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy thông tin hợp đồng thành công")
    public ResponseEntity<ContractDto> getContract(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(contractService.getContract(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật hợp đồng thành công")
    public ResponseEntity<ContractDto> updateContract(@PathVariable(name = "id") int id,
                                                      @RequestPart(value = "drawingContract", required = false) MultipartFile drawingContract,
                                                      @ModelAttribute Contract contract) throws URISyntaxException {
        return ResponseEntity.ok(contractService.updateContract(id, drawingContract, contract));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa hợp đồng thành công")
    public ResponseEntity<Void> deleteContract(@PathVariable(name = "id") int id) throws URISyntaxException {
        contractService.deleteContract(id);
        return ResponseEntity.ok(null);
    }

    @PutMapping("/send/{id}")
    @ApiMessage("Gửi tài khoản đăng nhập cho khách hàng thành công")
    public ResponseEntity<ContractDto> sendContract(@PathVariable(name = "id") int id){
        return ResponseEntity.ok(contractService.sendMailContractCustomer(id));
    }

    @PutMapping("/confirmation/{id}")
    @ApiMessage("Khách hàng gửi xác nhận hợp đồng thành công")
    public ResponseEntity<ContractDto> sendConfirmationContract(@PathVariable(name = "id") int id,
                                                                @RequestBody ConfirmationRequestDto confirmationRequestDto) {
        return ResponseEntity.ok(contractService.sendContractConfirmation(id, confirmationRequestDto));
    }
}
