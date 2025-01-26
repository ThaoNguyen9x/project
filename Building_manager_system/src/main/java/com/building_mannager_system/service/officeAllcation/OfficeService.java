package com.building_mannager_system.service.officeAllcation;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.repository.office.LocationRepository;
import com.building_mannager_system.repository.office.OfficeRepository;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
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
public class OfficeService {
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
                         FileService fileService) {
        this.officeRepository = officeRepository;
        this.modelMapper = modelMapper;
        this.locationRepository = locationRepository;
        this.fileService = fileService;
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

    public OfficesDto createOffice(MultipartFile drawing, Office office) {
        // Check location
        if (office.getLocation() != null) {
            Location location = locationRepository.findById(office.getLocation().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + office.getLocation().getId()));
            office.setLocation(location);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Location information is invalid or missing");
        }

        fileService.validateFile(drawing, allowedExtensions);
        office.setDrawingFile(fileService.storeFile(drawing, folder));

        return modelMapper.map(officeRepository.save(office), OfficesDto.class);
    }

    public OfficesDto getOffice(int id) {
        Office office = officeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + id));

        return modelMapper.map(office, OfficesDto.class);
    }

    public OfficesDto updateOffice(int id, MultipartFile drawing, Office office) throws URISyntaxException {
        Office ex = officeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + id));

        // Check location
        if (office.getLocation() != null) {
            Location location = locationRepository.findById(office.getLocation().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Location not found with ID: " + office.getLocation().getId()));
            office.setLocation(location);
        } else {
            throw new APIException(HttpStatus.NOT_FOUND, "Location information is invalid or missing");
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

        ex.setName(office.getName());
        ex.setLocation(office.getLocation());
        ex.setArea(office.getArea());
        ex.setRentPrice(office.getRentPrice());
        ex.setServiceFee(office.getServiceFee());
        ex.setStatus(office.getStatus());

        return modelMapper.map(officeRepository.save(ex), OfficesDto.class);
    }

    public void deleteOffice(int id) throws URISyntaxException {
        Office office = officeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + id));

        try {
            if (office.getDrawingFile() != null) {
                fileService.deleteFile(baseURI + folder + "/" + office.getDrawingFile());
            }

            officeRepository.delete(office);
        } catch (DataIntegrityViolationException e) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Đang hoạt động không thể xóa");
        }
    }
}
