package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.HandoverStatusDto;
import com.building_mannager_system.entity.customer_service.contact_manager.HandoverStatus;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.repository.Contract.HandoverStatusRepository;
import com.building_mannager_system.repository.office.OfficeRepository;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HandoverStatusService {
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "handover_status";
    List<String> allowedExtensions = Arrays.asList("pdf");

    private final HandoverStatusRepository handoverStatusRepository;
    private final ModelMapper modelMapper;
    private final OfficeRepository officeRepository;
    private final FileService fileService;

    public HandoverStatusService(HandoverStatusRepository handoverStatusRepository,
                                 ModelMapper modelMapper,
                                 OfficeRepository officeRepository,
                                 FileService fileService) {
        this.handoverStatusRepository = handoverStatusRepository;
        this.modelMapper = modelMapper;
        this.officeRepository = officeRepository;
        this.fileService = fileService;
    }

    public ResultPaginationDTO getAllHandoverStatus(Specification<HandoverStatus> spec,
                                                    Pageable pageable) {

        Page<HandoverStatus> page = handoverStatusRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<HandoverStatusDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, HandoverStatusDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    @Transactional
    public HandoverStatusDto createHandoverStatus(MultipartFile equipment, MultipartFile drawing, HandoverStatus handoverStatus) throws IOException, URISyntaxException {
        // Check office
        if (handoverStatus.getOffice() != null) {
            Office office = officeRepository.findById(handoverStatus.getOffice().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + handoverStatus.getOffice().getId()));
            handoverStatus.setOffice(office);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Office information is invalid or missing");
        }

        fileService.validateFile(equipment, allowedExtensions);
        handoverStatus.setEquipmentFile(fileService.storeFile(equipment, folder));

        fileService.validateFile(drawing, allowedExtensions);
        handoverStatus.setDrawingFile(fileService.storeFile(drawing, folder));

        return modelMapper.map(handoverStatusRepository.save(handoverStatus), HandoverStatusDto.class);
    }

    public HandoverStatusDto getHandoverStatus(int id) {
        HandoverStatus handoverStatus = handoverStatusRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Handover status not found with ID: " + id));

        return modelMapper.map(handoverStatus, HandoverStatusDto.class);
    }

    public HandoverStatusDto updateHandoverStatus(int id, MultipartFile equipment, MultipartFile drawing, HandoverStatus handoverStatus) throws URISyntaxException, IOException {
        HandoverStatus ex = handoverStatusRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Handover status not found with ID: " + id));

        // Check office
        if (handoverStatus.getOffice() != null && handoverStatus.getOffice().getId() != null) {
            Office office = officeRepository.findById(handoverStatus.getOffice().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + handoverStatus.getOffice().getId()));
            handoverStatus.setOffice(office);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Office information is invalid or missing");
        }

        if (equipment != null && !equipment.isEmpty()) {
            fileService.validateFile(equipment, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getEquipmentFile() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getEquipmentFile());
            }

            // Lưu tệp mới
            ex.setEquipmentFile(fileService.storeFile(equipment, folder));
        }

        if (drawing != null && !drawing.isEmpty()) {
            fileService.validateFile(drawing, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getDrawingFile() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getDrawingFile());
            }

            // Lưu tệp mới
            ex.setDrawingFile(fileService.storeFile(drawing, folder));
        }

        ex.setHandoverDate(handoverStatus.getHandoverDate());
        ex.setStatus(handoverStatus.getStatus());
        ex.setOffice(handoverStatus.getOffice());

        return modelMapper.map(handoverStatusRepository.save(ex), HandoverStatusDto.class);
    }

    public void deleteHandoverStatus(int id) throws URISyntaxException {
        HandoverStatus handoverStatus = handoverStatusRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Handover status not found with ID: " + id));

        if (handoverStatus.getDrawingFile() != null) {
            fileService.deleteFile(baseURI + folder + "/" + handoverStatus.getDrawingFile());
        }

        if (handoverStatus.getEquipmentFile() != null) {
            fileService.deleteFile(baseURI + folder + "/" + handoverStatus.getEquipmentFile());
        }

        handoverStatusRepository.delete(handoverStatus);
    }
}
