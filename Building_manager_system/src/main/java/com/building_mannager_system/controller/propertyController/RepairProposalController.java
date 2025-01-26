package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.RepairProposalDto;
import com.building_mannager_system.entity.property_manager.RepairProposal;
import com.building_mannager_system.service.system_service.RepairProposalService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repair-proposals")
public class RepairProposalController {

    private final RepairProposalService repairProposalService;

    public RepairProposalController(RepairProposalService repairProposalService) {
        this.repairProposalService = repairProposalService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách đề xuất bảo trì thành công")
    public ResponseEntity<ResultPaginationDTO> getAllRepairProposals(@Filter Specification<RepairProposal> spec,
                                                            Pageable pageable) {
        return ResponseEntity.ok(repairProposalService.getAllRepairProposals(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo đề xuất bảo trì thành công")
    public ResponseEntity<RepairProposalDto> createRepairProposal(@RequestBody RepairProposal repairProposal) {
        return new ResponseEntity<>(repairProposalService.createRepairProposal(repairProposal), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy đề xuất bảo trì thành công")
    public ResponseEntity<RepairProposalDto> getRepairProposal(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(repairProposalService.getRepairProposal(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật đề xuất bảo trì thành công")
    public ResponseEntity<RepairProposalDto> updateRepairProposal(@PathVariable(name = "id") Long id,
                                                @RequestBody RepairProposal repairProposal) {
        return ResponseEntity.ok(repairProposalService.updateRepairProposal(id, repairProposal));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa đề xuất bảo trì thành công")
    public ResponseEntity<Void> deleteRepairProposal(@PathVariable(name = "id") Long id) {
        repairProposalService.deleteRepairProposal(id);
        return ResponseEntity.ok(null);
    }
}
