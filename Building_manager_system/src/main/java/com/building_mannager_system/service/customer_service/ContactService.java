package com.building_mannager_system.service.customer_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.ContactDto;
import com.building_mannager_system.entity.customer_service.customer_manager.Contact;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.repository.Contract.ContactRepository;
import com.building_mannager_system.repository.Contract.CustomerRepository;
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
public class ContactService {

    private final ContactRepository contactRepository;
    private final ModelMapper modelMapper;
    private final CustomerRepository customerRepository;

    public ContactService(ContactRepository contactRepository,
                          ModelMapper modelMapper, CustomerRepository customerRepository) {
        this.contactRepository = contactRepository;
        this.modelMapper = modelMapper;
        this.customerRepository = customerRepository;
    }

    public ResultPaginationDTO getAllContacts(Specification<Contact> spec,
                                              Pageable pageable) {

        Page<Contact> page = contactRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<ContactDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ContactDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public ContactDto createContact(Contact contact) {
        // Check customer
        if (contact.getCustomer() != null) {
            Customer customer = customerRepository.findById(contact.getCustomer().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + contact.getCustomer().getId()));
            contact.setCustomer(customer);
        }

        return modelMapper.map(contactRepository.save(contact), ContactDto.class);
    }

    public ContactDto getContact(int id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contact not found with ID: " + id));

        return modelMapper.map(contact, ContactDto.class);
    }

    public ContactDto updateContact(int id, Contact contact) {
        Contact ex = contactRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contact not found with ID: " + id));

        // Check customer
        if (contact.getCustomer() != null) {
            Customer customer = customerRepository.findById(contact.getCustomer().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + contact.getCustomer().getId()));
            contact.setCustomer(customer);
        }

        ex.setContactName(contact.getContactName());
        ex.setContactEmail(contact.getContactEmail());
        ex.setContactPhone(contact.getContactPhone());
        ex.setPosition(contact.getPosition());
        ex.setCustomer(contact.getCustomer());

        return modelMapper.map(contactRepository.save(ex), ContactDto.class);
    }

    public void deleteContact(int id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contact not found with ID: " + id));

        contactRepository.delete(contact);
    }
}
