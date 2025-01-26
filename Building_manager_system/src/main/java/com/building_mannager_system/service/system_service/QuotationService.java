package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.QuotationDto;
import com.building_mannager_system.entity.property_manager.Quotation;
import com.building_mannager_system.entity.property_manager.RepairProposal;
import com.building_mannager_system.repository.system_manager.QuotationRepository;
import com.building_mannager_system.repository.system_manager.RepairProposalRepository;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuotationService {
    private final RepairProposalRepository repairProposalRepository;
    private final FileService fileService;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "quotations";
    List<String> allowedExtensions = Arrays.asList("pdf");

    private final QuotationRepository quotationRepository;
    private final ModelMapper modelMapper;

    public QuotationService(QuotationRepository quotationRepository,
                            ModelMapper modelMapper, RepairProposalRepository repairProposalRepository, FileService fileService) {
        this.quotationRepository = quotationRepository;
        this.modelMapper = modelMapper;
        this.repairProposalRepository = repairProposalRepository;
        this.fileService = fileService;
    }

    public ResultPaginationDTO getAllQuotations(Specification<Quotation> spec,
                                                       Pageable pageable) {

        Page<Quotation> page = quotationRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<QuotationDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, QuotationDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public QuotationDto createQuotation(MultipartFile file, Quotation quotation) {
        // Check Repair Proposal
        if (quotation.getRepairProposal() != null) {
            RepairProposal repairProposal = repairProposalRepository.findById(quotation.getRepairProposal().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair proposal not found with ID: " + quotation.getRepairProposal().getId()));
            quotation.setRepairProposal(repairProposal);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Repair proposal information is invalid or missing");
        }

        fileService.validateFile(file, allowedExtensions);
        quotation.setFileName(fileService.storeFile(file, folder));

        return modelMapper.map(quotationRepository.save(quotation), QuotationDto.class);
    }

    public QuotationDto getQuotation(Long id) {
        Quotation ex = quotationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Quotation not found with ID: " + id));

        return modelMapper.map(ex, QuotationDto.class);
    }

    public void deleteQuotation(Long id) throws URISyntaxException {
        Quotation ex = quotationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Quotation not found with ID: " + id));

        if (ex.getFileName() != null) {
            fileService.deleteFile(baseURI + folder + "/" + ex.getFileName());
        }

        quotationRepository.delete(ex);
    }

    public QuotationDto updateQuotation(Long id, MultipartFile file, Quotation quotation) throws URISyntaxException {
        Quotation ex = quotationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Quotation not found with ID: " + id));

        // Check Repair Proposal
        if (quotation.getRepairProposal() != null) {
            RepairProposal repairProposal = repairProposalRepository.findById(quotation.getRepairProposal().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair proposal not found with ID: " + quotation.getRepairProposal().getId()));
            quotation.setRepairProposal(repairProposal);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Repair proposal information is invalid or missing");
        }

        if (file != null && !file.isEmpty()) {
            fileService.validateFile(file, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getFileName() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getFileName());
            }

            // Lưu tệp mới
            ex.setFileName(fileService.storeFile(file, folder));
        }

        ex.setSupplierName(quotation.getSupplierName());
        ex.setTotalAmount(quotation.getTotalAmount());
        ex.setDetails(quotation.getDetails());
        ex.setStatus(quotation.getStatus());
        ex.setRepairProposal(quotation.getRepairProposal());

        return modelMapper.map(quotationRepository.save(ex), QuotationDto.class);
    }
}
