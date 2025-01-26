package com.building_mannager_system.service.customer_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDocumentDto;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerType;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerTypeDocument;
import com.building_mannager_system.repository.Contract.CustomerTypeDocumentRepository;
import com.building_mannager_system.repository.Contract.CustomerTypeRepository;
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
public class CustomerTypeDocumentService {
    private final CustomerTypeDocumentRepository customerTypeDocumentRepository;
    private final ModelMapper modelMapper;
    private final CustomerTypeRepository customerTypeRepository;

    public CustomerTypeDocumentService(CustomerTypeDocumentRepository customerTypeDocumentRepository,
                                       ModelMapper modelMapper,
                                       CustomerTypeRepository customerTypeRepository) {
        this.customerTypeDocumentRepository = customerTypeDocumentRepository;
        this.modelMapper = modelMapper;
        this.customerTypeRepository = customerTypeRepository;
    }

    public ResultPaginationDTO getAllCustomerTypeDocuments(Specification<CustomerTypeDocument> spec,
                                                           Pageable pageable) {

        Page<CustomerTypeDocument> page = customerTypeDocumentRepository.findAll(spec, pageable);
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

    public CustomerTypeDocumentDto createCustomerTypeDocument(CustomerTypeDocument customerTypeDocument) {
        if (customerTypeDocumentRepository.existsByDocumentTypeAndCustomerType_Id(customerTypeDocument.getDocumentType(), customerTypeDocument.getCustomerType().getId()))
            throw new APIException(HttpStatus.BAD_REQUEST, "Đã tồn tại một hồ sơ phân loại cùng loại tài liệu hoặc loại khách hàng");

        // Check customerType
        if (customerTypeDocument.getCustomerType() != null) {
            CustomerType customerType = customerTypeRepository.findById(customerTypeDocument.getCustomerType().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type not found with ID: " + customerTypeDocument.getCustomerType().getId()));
            customerTypeDocument.setCustomerType(customerType);
        }

        return modelMapper.map(customerTypeDocumentRepository.save(customerTypeDocument), CustomerTypeDocumentDto.class);
    }

    public CustomerTypeDocumentDto getCustomerTypeDocument(int id) {
        CustomerTypeDocument ex = customerTypeDocumentRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type document not found with ID: " + id));

        return modelMapper.map(ex, CustomerTypeDocumentDto.class);
    }

    public CustomerTypeDocumentDto updateCustomerTypeDocument(int id, CustomerTypeDocument customerTypeDocument) {
        CustomerTypeDocument ex = customerTypeDocumentRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type document not found with ID: " + id));

        if (customerTypeDocumentRepository.existsByDocumentTypeAndCustomerType_IdAndIdNot(customerTypeDocument.getDocumentType(), customerTypeDocument.getCustomerType().getId(), id))
            throw new APIException(HttpStatus.BAD_REQUEST, "Đã tồn tại một hồ sơ phân loại cùng loại tài liệu hoặc loại khách hàng");

        // Check customerType
        if (customerTypeDocument.getCustomerType() != null) {
            CustomerType customerType = customerTypeRepository.findById(customerTypeDocument.getCustomerType().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type not found with ID: " + customerTypeDocument.getCustomerType().getId()));
            customerTypeDocument.setCustomerType(customerType);
        }

        ex.setCustomerType(customerTypeDocument.getCustomerType());
        ex.setDocumentType(customerTypeDocument.getDocumentType());
        ex.setStatus(customerTypeDocument.isStatus());

        return modelMapper.map(customerTypeDocumentRepository.save(ex), CustomerTypeDocumentDto.class);
    }

    public void deleteCustomerTypeDocument(int id) {
        CustomerTypeDocument ex = customerTypeDocumentRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer type document not found with ID: " + id));

        customerTypeDocumentRepository.delete(ex);
    }

    public List<CustomerTypeDocumentDto> findByCustomerTypeAndStatus(Integer customerTypeId, boolean status) {
        return customerTypeDocumentRepository.findByCustomerTypeIdAndStatus(customerTypeId, status)
                .stream()
                .map(item -> modelMapper.map(item, CustomerTypeDocumentDto.class))
                .collect(Collectors.toList());
    }
}
