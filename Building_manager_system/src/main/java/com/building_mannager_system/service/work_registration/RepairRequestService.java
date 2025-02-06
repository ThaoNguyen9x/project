package com.building_mannager_system.service.work_registration;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.work_registration.RepairRequestDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.work_registration.RepairRequest;
import com.building_mannager_system.enums.RequestStatus;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.work_registration.RepairRequestRepository;
import com.building_mannager_system.security.SecurityUtil;
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
public class RepairRequestService {
    private final UserRepository userRepository;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "repair_requests";
    List<String> allowedExtensions = Arrays.asList("pdf");

    private final RepairRequestRepository repairRequestRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;

    public RepairRequestService(RepairRequestRepository repairRequestRepository,
                                ModelMapper modelMapper,
                                FileService fileService, UserRepository userRepository) {
        this.repairRequestRepository = repairRequestRepository;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.userRepository = userRepository;
    }

    // ✅ Tạo mới RepairRequest
    public RepairRequestDto createRepairRequest(MultipartFile image, RepairRequest repairRequest) {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User user = userRepository.findByEmail(email);

        fileService.validateFile(image, allowedExtensions);
        repairRequest.setImageUrl(fileService.storeFile(image, folder));

        repairRequest.setAccount(user);

        return modelMapper.map(repairRequestRepository.save(repairRequest), RepairRequestDto.class);
    }

    // ✅ Lấy tất cả RepairRequests
    public ResultPaginationDTO getAllRepairRequests(Specification<RepairRequest> spec,
                                              Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().orElse("");

        User user = userRepository.findByEmail(email);
        if (user == null) throw new APIException(HttpStatus.NOT_FOUND, "User not found");

        if (user.getRole().getName().equals("Customer")) {
            spec = Specification.where((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("account").get("id"), user.getId()));
        }

        Page<RepairRequest> page = repairRequestRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<RepairRequestDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, RepairRequestDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    // ✅ Lấy RepairRequest theo ID
    public RepairRequestDto getRepairRequest(int id) {
        RepairRequest repairRequest = repairRequestRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair Request not found with ID: " + id));
        return modelMapper.map(repairRequest, RepairRequestDto.class);
    }


    // ✅ Cập nhật RepairRequest
    public RepairRequestDto updateRepairRequest(int id, MultipartFile image, RepairRequest repairRequest) throws URISyntaxException {
        RepairRequest ex = repairRequestRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair Request not found with ID: " + id));

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User user = userRepository.findByEmail(email);

        if (image != null && !image.isEmpty()) {
            fileService.validateFile(image, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getImageUrl() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getImageUrl());
            }

            // Lưu tệp mới
            ex.setImageUrl(fileService.storeFile(image, folder));
        }

        ex.setAccount(user);
        ex.setContent(repairRequest.getContent());
        ex.setStatus(repairRequest.getStatus());
        ex.setRequestDate(repairRequest.getRequestDate());

        return modelMapper.map(repairRequestRepository.save(ex), RepairRequestDto.class);
    }

    // ✅ Xóa RepairRequest
    public void deleteRepairRequest(int id) throws URISyntaxException {
        RepairRequest ex = repairRequestRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Repair Request not found with ID: " + id));

        if (ex.getImageUrl() != null) {
            fileService.deleteFile(baseURI + folder + "/" + ex.getImageUrl());
        }

        repairRequestRepository.delete(ex);
    }
}
