package com.building_mannager_system.service.notification;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.verificationDto.RecipientDto;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.notification.Recipient;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.notification.RecipientRepository;
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
public class RecipientService {

    private final RecipientRepository recipientRepository;
    private final ModelMapper modelMapper;
    private final CustomerRepository customerRepository;

    public RecipientService(RecipientRepository recipientRepository,
                            ModelMapper modelMapper, CustomerRepository customerRepository) {
        this.recipientRepository = recipientRepository;
        this.modelMapper = modelMapper;
        this.customerRepository = customerRepository;
    }

    public ResultPaginationDTO getAllRecipients(Specification<Recipient> spec,
                                              Pageable pageable) {

        Page<Recipient> page = recipientRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<RecipientDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, RecipientDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public Recipient createRecipient(Recipient recipient) {
        return recipientRepository.save(recipient);
    }


    public RecipientDto getRecipient(int id) {
        Recipient recipient = recipientRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Recipient not found with ID: " + id));

        return modelMapper.map(recipient, RecipientDto.class);
    }

    public RecipientDto updateRecipient(int id, Recipient recipient) {
        Recipient ex = recipientRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Recipient not found with ID: " + id));

        ex.setName(recipient.getName());
        ex.setType(recipient.getType());
        ex.setReferenceId(recipient.getReferenceId());

        return modelMapper.map(recipientRepository.save(ex), RecipientDto.class);
    }

    public void deleteRecipient(int id) {
        Recipient recipient = recipientRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Recipient not found with ID: " + id));

        recipientRepository.delete(recipient);
    }
}
