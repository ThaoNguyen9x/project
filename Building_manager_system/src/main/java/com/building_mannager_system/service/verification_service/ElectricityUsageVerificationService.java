package com.building_mannager_system.service.verification_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.verificationDto.ElectricityUsageVerificationDto;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.building_mannager_system.entity.verification.ElectricityUsageVerification;
import com.building_mannager_system.repository.system_manager.MeterRepository;
import com.building_mannager_system.repository.verificationRepository.ElectricityUsageVerificationRepository;
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
public class ElectricityUsageVerificationService {
    private final MeterRepository meterRepository;
    private final FileService fileService;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "electricity-usage-verifications";
    List<String> allowedExtensions = Arrays.asList("pdf");

    private final ElectricityUsageVerificationRepository electricityUsageVerificationRepository;
    private final ModelMapper modelMapper;

    public ElectricityUsageVerificationService(ElectricityUsageVerificationRepository electricityUsageVerificationRepository,
                                               ModelMapper modelMapper, MeterRepository meterRepository, FileService fileService) {
        this.electricityUsageVerificationRepository = electricityUsageVerificationRepository;
        this.modelMapper = modelMapper;
        this.meterRepository = meterRepository;
        this.fileService = fileService;
    }

    public ResultPaginationDTO getAllElectricityUsageVerifications(Specification<ElectricityUsageVerification> spec,
                                                    Pageable pageable) {

        Page<ElectricityUsageVerification> page = electricityUsageVerificationRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<ElectricityUsageVerificationDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ElectricityUsageVerificationDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public ElectricityUsageVerificationDto createElectricityUsageVerification(MultipartFile file,
                                                                              ElectricityUsageVerification electricityUsageVerification) {
        // Check meter
        if (electricityUsageVerification.getMeter() != null) {
            Meter meter = meterRepository.findById(electricityUsageVerification.getMeter().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Meter not found with ID: " + electricityUsageVerification.getMeter().getId()));
            electricityUsageVerification.setMeter(meter);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Meter information is invalid or missing");
        }

        fileService.validateFile(file, allowedExtensions);
        electricityUsageVerification.setImageName(fileService.storeFile(file, folder));

        return modelMapper.map(electricityUsageVerificationRepository.save(electricityUsageVerification), ElectricityUsageVerificationDto.class);
    }

    public ElectricityUsageVerificationDto getElectricityUsageVerification(int id) {
        ElectricityUsageVerification ex = electricityUsageVerificationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity usage verification not found with ID: " + id));

        return modelMapper.map(ex, ElectricityUsageVerificationDto.class);
    }

    public ElectricityUsageVerificationDto updateElectricityUsageVerification(int id, MultipartFile file,
                                                                              ElectricityUsageVerification electricityUsageVerification) throws URISyntaxException {
        ElectricityUsageVerification ex = electricityUsageVerificationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity usage verification not found with ID: " + id));

        // Check meter
        if (electricityUsageVerification.getMeter() != null) {
            Meter meter = meterRepository.findById(electricityUsageVerification.getMeter().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Meter not found with ID: " + electricityUsageVerification.getMeter().getId()));
            electricityUsageVerification.setMeter(meter);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Meter information is invalid or missing");
        }

        if (file != null && !file.isEmpty()) {
            fileService.validateFile(file, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getImageName() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getImageName());
            }

            // Lưu tệp mới
            ex.setImageName(fileService.storeFile(file, folder));
        }

        ex.setMeter(electricityUsageVerification.getMeter());
        ex.setStartReading(electricityUsageVerification.getStartReading());
        ex.setEndReading(electricityUsageVerification.getEndReading());
        ex.setReadingDate(electricityUsageVerification.getReadingDate());
        ex.setPreviousMonthImageName(electricityUsageVerification.getPreviousMonthImageName());
        ex.setStatus(electricityUsageVerification.getStatus());
        ex.setPreviousMonthCost(electricityUsageVerification.getPreviousMonthCost());
        ex.setUsageAmountPreviousMonth(electricityUsageVerification.getUsageAmountPreviousMonth());
        ex.setUsageAmountCurrentMonth(electricityUsageVerification.getUsageAmountCurrentMonth());
        ex.setCurrentMonthCost(electricityUsageVerification.getCurrentMonthCost());

        return modelMapper.map(electricityUsageVerificationRepository.save(ex), ElectricityUsageVerificationDto.class);
    }

    public void deleteElectricityUsageVerification(int id) throws URISyntaxException {
        ElectricityUsageVerification ex = electricityUsageVerificationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity usage verification not found with ID: " + id));

        if (ex.getImageName() != null) {
            fileService.deleteFile(baseURI + folder + "/" + ex.getImageName());
        }

        electricityUsageVerificationRepository.delete(ex);
    }
}

