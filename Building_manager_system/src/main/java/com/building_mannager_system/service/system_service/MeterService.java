package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.CustomerDto;
import com.building_mannager_system.dto.requestDto.propertyDto.MeterDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.office.OfficeRepository;
import com.building_mannager_system.repository.system_manager.MeterRepository;
import com.building_mannager_system.security.SecurityUtil;
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
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public MeterService(MeterRepository meterRepository,
                        ModelMapper modelMapper, OfficeRepository officeRepository, UserRepository userRepository, CustomerRepository customerRepository) {
        this.meterRepository = meterRepository;
        this.modelMapper = modelMapper;
        this.officeRepository = officeRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    public ResultPaginationDTO getAllMeters(Specification<Meter> spec, Pageable pageable) {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User user = userRepository.findByEmail(email);
        if (user == null) throw new APIException(HttpStatus.NOT_FOUND, "User not found");

        if ("Customer".equals(user.getRole().getName())) {
            if (user.getCustomer() == null) {
                throw new APIException(HttpStatus.BAD_REQUEST, "User có role Customer nhưng không có liên kết Customer");
            }

            Customer customer = customerRepository.findById(user.getCustomer().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found"));

            Contract contract = customer.getContracts().stream()
                    .findFirst()
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found"));

            Meter meter = null;
            if (contract.getOffice() != null && !contract.getOffice().getMeters().isEmpty()) {
                meter = meterRepository.findById(contract.getOffice().getMeters().get(0).getId())
                        .orElse(null);
            }

            if (meter != null) {
                Meter finalMeter = meter;
                spec = Specification.where((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("serialNumber"), finalMeter.getSerialNumber()));
            }
        }

        Page<Meter> page = meterRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);

        List<MeterDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, MeterDto.class))
                .collect(Collectors.toList());
        rs.setResult(list);

        return rs;
    }

    public MeterDto createMeter(Meter meter) {

        if (meterRepository.existsBySerialNumber(meter.getSerialNumber())) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Serial Number này đã được sử dụng");
        }

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

        if (meterRepository.existsBySerialNumberNotAndId(meter.getSerialNumber(), id)) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Serial Number này đã được sử dụng");
        }

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
