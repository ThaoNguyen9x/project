package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.dto.requestDto.propertyDto.MeterDto;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.building_mannager_system.repository.office.OfficeRepository;
import com.building_mannager_system.repository.system_manager.MeterRepository;
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
public class MeterService {
    private final MeterRepository meterRepository;
    private final ModelMapper modelMapper;
    private final OfficeRepository officeRepository;

    public MeterService(MeterRepository meterRepository,
                        ModelMapper modelMapper, OfficeRepository officeRepository) {
        this.meterRepository = meterRepository;
        this.modelMapper = modelMapper;
        this.officeRepository = officeRepository;
    }

    public ResultPaginationDTO getAllMeters(Specification<Meter> spec,
                                                   Pageable pageable) {

        Page<Meter> page = meterRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<MeterDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, MeterDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public MeterDto createMeter(Meter meter) {

        if (meterRepository.existsBySerialNumber(meter.getSerialNumber()))
            throw new APIException(HttpStatus.BAD_REQUEST, "Serial Number này đã được sử dụng");

        // Check office
        if (meter.getOffice() != null) {
            Office office = officeRepository.findById(meter.getOffice().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + meter.getOffice().getId()));
            meter.setOffice(office);
        }
        
        return modelMapper.map(meterRepository.save(meter), MeterDto.class);
    }

    public MeterDto getMeter(int id) {
        Meter meter = meterRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Meter not found with ID: " + id));

        return modelMapper.map(meter, MeterDto.class);
    }

    public MeterDto updateMeter(int id, Meter meter) {
        Meter ex = meterRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Meter not found with ID: " + id));

        if (meterRepository.existsBySerialNumberNotAndId(meter.getSerialNumber(), id))
            throw new APIException(HttpStatus.BAD_REQUEST, "Serial Number này đã được sử dụng");

        // Check office
        if (meter.getOffice() != null) {
            Office office = officeRepository.findById(meter.getOffice().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Office not found with ID: " + meter.getOffice().getId()));
            meter.setOffice(office);
        }

        ex.setOffice(meter.getOffice());
        ex.setMeterType(meter.getMeterType());
        ex.setSerialNumber(ex.getSerialNumber());
        ex.setInstallationDate(meter.getInstallationDate());

        return modelMapper.map(meterRepository.save(ex), MeterDto.class);
    }

    public void deleteMeter(int id) {
        Meter meter = meterRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Meter not found with ID: " + id));

        meterRepository.delete(meter);
    }
}
