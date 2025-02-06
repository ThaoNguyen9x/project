package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.ElectricityRateDto;
import com.building_mannager_system.entity.customer_service.system_manger.ElectricityRate;
import com.building_mannager_system.repository.system_manager.ElectricityRateRepository;
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
public class ElectricityRateService {
    private final ElectricityRateRepository electricityRateRepository;
    private final ModelMapper modelMapper;

    public ElectricityRateService(ElectricityRateRepository electricityRateRepository,
                                  ModelMapper modelMapper) {
        this.electricityRateRepository = electricityRateRepository;
        this.modelMapper = modelMapper;
    }

    public ResultPaginationDTO getAllElectricityRates(Specification<ElectricityRate> spec,
                                                 Pageable pageable) {

        Page<ElectricityRate> page = electricityRateRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<ElectricityRateDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ElectricityRateDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public ElectricityRateDto createElectricityRate(ElectricityRate deviceType) {
        return modelMapper.map(electricityRateRepository.save(deviceType), ElectricityRateDto.class);
    }

    public ElectricityRateDto getElectricityRate(int id) {
        ElectricityRate deviceType = electricityRateRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity rate not found with ID: " + id));

        return modelMapper.map(deviceType, ElectricityRateDto.class);
    }

    public ElectricityRateDto updateElectricityRate(int id, ElectricityRate deviceType) {
        ElectricityRate ex = electricityRateRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity rate not found with ID: " + id));

        ex.setTierName(deviceType.getTierName());
        ex.setRate(deviceType.getRate());
        ex.setMaxUsage(deviceType.getMaxUsage());
        ex.setMinUsage(deviceType.getMinUsage());

        return modelMapper.map(electricityRateRepository.save(ex), ElectricityRateDto.class);
    }

    public void deleteElectricityRate(int id) {
        ElectricityRate deviceType = electricityRateRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Electricity rate not found with ID: " + id));

        electricityRateRepository.delete(deviceType);
    }
}
