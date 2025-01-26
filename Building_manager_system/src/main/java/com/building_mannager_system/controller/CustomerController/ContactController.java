package com.building_mannager_system.controller.CustomerController;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.customer.ContactDto;
import com.building_mannager_system.entity.customer_service.customer_manager.Contact;
import com.building_mannager_system.service.customer_service.ContactService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    @ApiMessage("Contacts Retrieved Successfully")
    public ResponseEntity<ResultPaginationDTO> getAllContacts(@Filter Specification<Contact> spec,
                                                              Pageable pageable) {
        return ResponseEntity.ok(contactService.getAllContacts(spec, pageable));
    }

    @PostMapping
    @ApiMessage("Contact Created Successfully")
    public ResponseEntity<ContactDto> createContact(@RequestBody Contact contact) {
        return new ResponseEntity<>(contactService.createContact(contact), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ApiMessage("Contact Retrieved Successfully")
    public ResponseEntity<ContactDto> getContact(@PathVariable(name = "id") int id) {
        return ResponseEntity.ok(contactService.getContact(id));
    }

    @PutMapping("/{id}")
    @ApiMessage("Contact Updated Successfully")
    public ResponseEntity<ContactDto> updateContact(@PathVariable(name = "id") int id,
                                                    @RequestBody Contact contact) {
        return ResponseEntity.ok(contactService.updateContact(id, contact));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Contact Deleted Successfully")
    public ResponseEntity<Void> deleteContact(@PathVariable(name = "id") int id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok(null);
    }
}
