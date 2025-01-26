package com.building_mannager_system.controller.propertyController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.RiskAssessmentDto;
import com.building_mannager_system.dto.requestDto.propertyDto.RiskAssessmentDto;
import com.building_mannager_system.dto.responseDto.ApiResponce;
import com.building_mannager_system.entity.property_manager.RiskAssessment;
import com.building_mannager_system.service.system_service.RiskAssessmentService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risk-assessments")
public class RiskAssessmentController {
    private final RiskAssessmentService riskAssessmentService;

    public RiskAssessmentController(RiskAssessmentService riskAssessmentService) {
        this.riskAssessmentService = riskAssessmentService;
    }

    @GetMapping
    @ApiMessage("Lấy danh sách đánh giá rủi ro thành công")
    public ResponseEntity<ResultPaginationDTO> getAllRiskAssessments(@Filter Specification<RiskAssessment> spec,
                                                                     Pageable pageable) {
        return ResponseEntity.ok(riskAssessmentService.getAllRiskAssessments(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Tạo đánh giá rủi ro thành công")
    public ResponseEntity<RiskAssessmentDto> createRiskAssessment(@RequestBody RiskAssessment riskAssessment) {
        return new ResponseEntity<>(riskAssessmentService.createRiskAssessment(riskAssessment), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy đánh giá rủi ro thành công")
    public ResponseEntity<RiskAssessmentDto> getRiskAssessment(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(riskAssessmentService.getRiskAssessment(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật đánh giá rủi ro thành công")
    public ResponseEntity<RiskAssessmentDto> updateRiskAssessment(@PathVariable(name = "id") int id,
                                                                  @RequestBody RiskAssessment riskAssessment) {
        return ResponseEntity.ok(riskAssessmentService.updateRiskAssessment(id, riskAssessment));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa đánh giá rủi ro thành công")
    public ResponseEntity<Void> deleteRiskAssessment(@PathVariable(name = "id") int id) {
        riskAssessmentService.deleteRiskAssessment(id);
        return ResponseEntity.ok(null);
    }
}
