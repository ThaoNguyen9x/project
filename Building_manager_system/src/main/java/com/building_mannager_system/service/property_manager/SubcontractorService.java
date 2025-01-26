package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.systemDto.SubcontractorDto;
import com.building_mannager_system.entity.property_manager.Subcontractor;
import com.building_mannager_system.entity.property_manager.Systems;
import com.building_mannager_system.repository.system_manager.SubcontractorsRepository;
import com.building_mannager_system.repository.system_manager.SystemsRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class SubcontractorService {

    private final SubcontractorsRepository subcontractorsRepository;
    private final ModelMapper modelMapper;
    private final SystemsRepository systemsRepository;

    public SubcontractorService(SubcontractorsRepository subcontractorsRepository,
                                ModelMapper modelMapper, SystemsRepository systemsRepository) {
        this.subcontractorsRepository = subcontractorsRepository;
        this.modelMapper = modelMapper;
        this.systemsRepository = systemsRepository;
    }

    public ResultPaginationDTO getAllSubcontractors(Specification<Subcontractor> spec,
                                                   Pageable pageable) {

        Page<Subcontractor> page = subcontractorsRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        return rs;
    }

    public SubcontractorDto createSubcontractor(Subcontractor subcontractor) {
        // Check Systems
        if (subcontractor.getSystem() != null) {
            Systems systems = systemsRepository.findById(subcontractor.getSystem().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System not found with ID: " + subcontractor.getSystem().getId()));
            subcontractor.setSystem(systems);
        }

        return modelMapper.map(subcontractorsRepository.save(subcontractor), SubcontractorDto.class);
    }

    public SubcontractorDto getSubcontractor(int id) {
        Subcontractor subcontractor = subcontractorsRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontract not found with ID: " + id));

        return modelMapper.map(subcontractor, SubcontractorDto.class);
    }

    public SubcontractorDto updateSubcontractor(int id, Subcontractor subcontractor) {
        Subcontractor ex = subcontractorsRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontract not found with ID: " + id));

        // Check Systems
        if (subcontractor.getSystem() != null) {
            Systems systems = systemsRepository.findById(subcontractor.getSystem().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System not found with ID: " + subcontractor.getSystem().getId()));
            subcontractor.setSystem(systems);
        }

        ex.setName(subcontractor.getName());
        ex.setPhone(subcontractor.getPhone());
        ex.setServiceType(subcontractor.getServiceType());
        ex.setContractStartDate(subcontractor.getContractStartDate());
        ex.setContractEndDate(subcontractor.getContractEndDate());
        ex.setRating(subcontractor.getRating());
        ex.setSystem(subcontractor.getSystem());

        return modelMapper.map(subcontractorsRepository.save(ex), SubcontractorDto.class);
    }

    public void deleteSubcontractor(int id) {
        Subcontractor subcontractor = subcontractorsRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Subcontract not found with ID: " + id));

        try {
            subcontractorsRepository.delete(subcontractor);
        } catch (DataIntegrityViolationException e) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Đang hoạt động không thể xóa");
        }
    }
}
