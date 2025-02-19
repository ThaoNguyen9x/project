package com.building_mannager_system.service.customer_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDto;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerType;
import com.building_mannager_system.repository.Contract.CustomerTypeRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerTypeService {

    private final CustomerTypeRepository customerTypeRepository;
    private final ModelMapper modelMapper;

    public CustomerTypeService(CustomerTypeRepository customerTypeRepository,
                               ModelMapper modelMapper) {
        this.customerTypeRepository = customerTypeRepository;
        this.modelMapper = modelMapper;
    }

    public ResultPaginationDTO getAllCustomerTypes(Specification<CustomerType> spec,
                                                   Pageable pageable) {

        Page<CustomerType> page = customerTypeRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);

        List<CustomerTypeDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, CustomerTypeDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public CustomerTypeDto createCustomerType(CustomerType customerType) {
        if (customerTypeRepository.existsByTypeName(customerType.getTypeName())) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên loại khách hàng này đã được sử dụng");
        }

        return modelMapper.map(customerTypeRepository.save(customerType), CustomerTypeDto.class);
    }

    public CustomerTypeDto getCustomerType(int id) {
        CustomerType customerType = customerTypeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type not found with ID: " + id));

        return modelMapper.map(customerType, CustomerTypeDto.class);
    }

    public CustomerTypeDto updateCustomerType(int id, CustomerType customerType) {
        CustomerType ex = customerTypeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type not found with ID: " + id));

        if (customerTypeRepository.existsByTypeNameAndIdNot(customerType.getTypeName(), id)) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên loại khách hàng này đã được sử dụng");
        }

        ex.setTypeName(customerType.getTypeName());
        ex.setStatus(customerType.isStatus());

        return modelMapper.map(customerTypeRepository.save(ex), CustomerTypeDto.class);
    }

    public void deleteCustomerType(int id) {
        CustomerType customerType = customerTypeRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type not found with ID: " + id));

        try {
            customerTypeRepository.delete(customerType);
        } catch (DataIntegrityViolationException e) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Đang hoạt động không thể xóa");
        }
    }
}
