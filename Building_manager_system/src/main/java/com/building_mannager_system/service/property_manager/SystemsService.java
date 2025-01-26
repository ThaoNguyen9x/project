package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.systemDto.SystemDto;
import com.building_mannager_system.entity.property_manager.Systems;
import com.building_mannager_system.repository.system_manager.SystemsRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SystemsService {

    private final SystemsRepository systemsRepository;
    private final ModelMapper modelMapper;

    public SystemsService(SystemsRepository systemsRepository,
                          ModelMapper modelMapper) {
        this.systemsRepository = systemsRepository;
        this.modelMapper = modelMapper;
    }

    public ResultPaginationDTO getAllSystems(Specification<Systems> spec,
                                              Pageable pageable) {

        Page<Systems> page = systemsRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<SystemDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, SystemDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public SystemDto createSystem(Systems systems) {
        if (systemsRepository.existsBySystemName(systems.getSystemName()))
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên hệ thống này đã được sử dụng");

        return modelMapper.map(systemsRepository.save(systems), SystemDto.class);
    }

    public SystemDto getSystem(Long id) {
        Systems systems = systemsRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System not found with ID: " + id));

        return modelMapper.map(systems, SystemDto.class);
    }

    public SystemDto updateSystem(Long id, Systems systems) {
        Systems ex = systemsRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System not found with ID: " + id));

        if (systemsRepository.existsBySystemNameAndIdNot(systems.getSystemName(), id))
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên hệ thống này đã được sử dụng");

        ex.setSystemName(systems.getSystemName());
        ex.setDescription(systems.getDescription());
        ex.setMaintenanceCycle(systems.getMaintenanceCycle());

        return modelMapper.map(systemsRepository.save(ex), SystemDto.class);
    }

    public void deleteSystem(Long id) {
        Systems systems = systemsRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "System not found with ID: " + id));

        systemsRepository.delete(systems);
    }
}
