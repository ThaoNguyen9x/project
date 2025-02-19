package com.building_mannager_system.service.officeAllcation;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.contact_manager.HandoverStatus;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.CommonArea;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.repository.Contract.ContractRepository;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.Contract.CustomerTypeRepository;
import com.building_mannager_system.repository.Contract.HandoverStatusRepository;
import com.building_mannager_system.repository.RoleRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.office.CommonAreaRepository;
import com.building_mannager_system.repository.office.LocationRepository;
import com.building_mannager_system.repository.office.OfficeRepository;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OfficeService {
    private final HandoverStatusRepository handoverStatusRepository;
    private final ContractRepository contractRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerTypeRepository customerTypeRepository;
    private final CommonAreaRepository commonAreaRepository;
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private String folder = "offices";
    List<String> allowedExtensions = Arrays.asList("pdf");

    private final OfficeRepository officeRepository;
    private final ModelMapper modelMapper;
    private final LocationRepository locationRepository;
    private final FileService fileService;

    public OfficeService(OfficeRepository officeRepository,
                         ModelMapper modelMapper,
                         LocationRepository locationRepository,
                         FileService fileService, HandoverStatusRepository handoverStatusRepository,
                         ContractRepository contractRepository,
                         CustomerRepository customerRepository,
                         UserRepository userRepository,
                         RoleRepository roleRepository,
                         PasswordEncoder passwordEncoder,
                         CustomerTypeRepository customerTypeRepository, CommonAreaRepository commonAreaRepository) {
        this.officeRepository = officeRepository;
        this.modelMapper = modelMapper;
        this.locationRepository = locationRepository;
        this.fileService = fileService;
        this.handoverStatusRepository = handoverStatusRepository;
        this.contractRepository = contractRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerTypeRepository = customerTypeRepository;
        this.commonAreaRepository = commonAreaRepository;
    }

    public ResultPaginationDTO getAllOffices(Specification<Office> spec,
                                             Pageable pageable) {

        Page<Office> page = officeRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<OfficesDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, OfficesDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    @Transactional
    public OfficesDto createOffice(MultipartFile drawingOffice, Office office) {
        Location location = locationRepository.findById(office.getLocation().getId())
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + office.getLocation().getId()));

        List<CommonArea> commonAreas = commonAreaRepository.findByLocation_Id(office.getLocation().getId());

        for (CommonArea area : commonAreas) {
            System.out.println("CommonArea ID: " + area.getId() +
                    "name: " + area.getName() +
                    ", StartX: " + area.getStartX() +
                    ", EndX: " + area.getEndX() +
                    ", StartY: " + area.getStartY() +
                    ", EndY: " + area.getEndY());
        }

        if (!office.isValidOffice(commonAreas)) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Office cannot be placed on an existing CommonArea");
        }

        office.setLocation(location);
        office.calculateArea();

        fileService.validateFile(drawingOffice, allowedExtensions);
        office.setDrawingFile(fileService.storeFile(drawingOffice, folder));

        return modelMapper.map(officeRepository.save(office), OfficesDto.class);
    }


    public OfficesDto getOffice(int id) {
        Office office = officeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + id));

        return modelMapper.map(office, OfficesDto.class);
    }

    public OfficesDto updateOffice(int id, MultipartFile drawingOffice, Office office) throws URISyntaxException {
        Office ex = officeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + id));

        // Check location
        if (office.getLocation() != null) {
            Location location = locationRepository.findById(office.getLocation().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + office.getLocation().getId()));
            ex.setLocation(location);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Location information is invalid or missing");
        }

        // Xử lý file bản vẽ
        if (drawingOffice != null && !drawingOffice.isEmpty()) {
            fileService.validateFile(drawingOffice, allowedExtensions);

            // Xóa tệp cũ nếu tồn tại
            if (ex.getDrawingFile() != null) {
                fileService.deleteFile(baseURI + folder + "/" + ex.getDrawingFile());
            }

            // Lưu tệp mới
            ex.setDrawingFile(fileService.storeFile(drawingOffice, folder));
        }

        ex.setName(office.getName());
        ex.setRentPrice(office.getRentPrice());
        ex.setServiceFee(office.getServiceFee());
        ex.setStartY(office.getStartY());
        ex.setStartX(office.getStartX());
        ex.setEndY(office.getEndY());
        ex.setEndX(office.getEndX());
        ex.setStatus(office.getStatus());

        ex.calculateArea();
        BigDecimal newArea = ex.getTotalArea();
        ex.setTotalArea(newArea);

        return modelMapper.map(officeRepository.save(ex), OfficesDto.class);
    }

    public void deleteOffice(int id) throws URISyntaxException {
        Office office = officeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + id));

        if (office.getDrawingFile() != null) {
            fileService.deleteFile(baseURI + folder + "/" + office.getDrawingFile());
        }

        officeRepository.delete(office);
    }
}
