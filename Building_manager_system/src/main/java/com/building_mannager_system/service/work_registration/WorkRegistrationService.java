package com.building_mannager_system.service.work_registration;


import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.dto.requestDto.work_registration.WorkRegistrationDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.work_registration.RepairRequest;
import com.building_mannager_system.entity.work_registration.WorkRegistration;
import com.building_mannager_system.enums.WorkStatus;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.work_registration.WorkRegistrationRepository;
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
public class WorkRegistrationService {
    private final FileService fileService;
    private final UserRepository userRepository;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "work_registrations";
    List<String> allowedExtensions = Arrays.asList("pdf");

    private final WorkRegistrationRepository workRegistrationRepository;
    private final ModelMapper modelMapper;

    public WorkRegistrationService(WorkRegistrationRepository workRegistrationRepository,
                                   ModelMapper modelMapper, FileService fileService, UserRepository userRepository) {
        this.workRegistrationRepository = workRegistrationRepository;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.userRepository = userRepository;
    }

    public WorkRegistrationDto createWorkRegistration(MultipartFile image, WorkRegistration workRegistration) {
        if (workRegistration.getAccount() != null) {
            User user = userRepository.findById(workRegistration.getAccount().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + workRegistration.getAccount().getId()));
            workRegistration.setAccount(user);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "User not found");
        }

        fileService.validateFile(image, allowedExtensions);
        workRegistration.setDrawingUrl(fileService.storeFile(image, folder));

        return modelMapper.map(workRegistrationRepository.save(workRegistration), WorkRegistrationDto.class);
    }

    // ✅ Lấy tất cả
    public ResultPaginationDTO getAllWorkRegistrations(Specification<WorkRegistration> spec,
                                                    Pageable pageable) {

        Page<WorkRegistration> page = workRegistrationRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<WorkRegistrationDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, WorkRegistrationDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    // ✅ Lấy theo ID
    public WorkRegistrationDto getWorkRegistration(int id) {
        WorkRegistration workRegistration = workRegistrationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Work registration not found with ID: " + id));

        return modelMapper.map(workRegistration, WorkRegistrationDto.class);
    }

    // ✅ Cập nhật trạng thái công việc
    public WorkRegistrationDto updateWorkRegistration(int id, MultipartFile image, WorkRegistration workRegistration) throws URISyntaxException {
        // Tìm kiếm bản ghi dựa trên ID
        WorkRegistration ex = workRegistrationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Work registration not found with ID: " + id));

        // Kiểm tra user
        if (workRegistration.getAccount() != null) {
            User user = userRepository.findById(workRegistration.getAccount().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + workRegistration.getAccount().getId()));
            workRegistration.setAccount(user);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (image != null && !image.isEmpty()) {
            fileService.validateFile(image, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getDrawingUrl() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getDrawingUrl());
            }

            // Lưu tệp mới
            ex.setDrawingUrl(fileService.storeFile(image, folder));
        }

        ex.setStatus(workRegistration.getStatus());
        ex.setRegistrationDate(workRegistration.getRegistrationDate());
        ex.setNote(workRegistration.getNote());
        ex.setAccount(workRegistration.getAccount());
        ex.setScheduledDate(workRegistration.getScheduledDate());

        return modelMapper.map(workRegistrationRepository.save(ex), WorkRegistrationDto.class);
    }

    // ✅ Xóa
    public void deleteWorkRegistration(int id) throws URISyntaxException {
        WorkRegistration ex = workRegistrationRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Work registration not found with ID: " + id));

        if (ex.getDrawingUrl() != null) {
            fileService.deleteFile(baseURI + folder + "/" + ex.getDrawingUrl());
        }

        workRegistrationRepository.delete(ex);
    }
}
