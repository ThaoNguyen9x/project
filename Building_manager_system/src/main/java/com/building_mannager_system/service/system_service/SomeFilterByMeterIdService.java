package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.requestDto.oficeSapceAllcationDto.OfficesDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.contact_manager.Office;
import com.building_mannager_system.entity.customer_service.customer_manager.Contact;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.customer_service.system_manger.Meter;
import com.building_mannager_system.repository.Contract.ContactRepository;
import com.building_mannager_system.repository.Contract.ContractRepository;
import com.building_mannager_system.repository.Contract.CustomerRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.office.OfficeRepository;
import com.building_mannager_system.repository.system_manager.MeterRepository;
import com.building_mannager_system.service.customer_service.ContactService;
import com.building_mannager_system.service.customer_service.ContractService;
import com.building_mannager_system.service.customer_service.CustomerService;
import com.building_mannager_system.utils.exception.APIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class SomeFilterByMeterIdService {
    private final MeterService meterService;
    private final ContractService contractService;
    private final MeterRepository meterRepository;
    private final OfficeRepository officeRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ContactRepository contactRepository;

    public SomeFilterByMeterIdService(MeterService meterService,
                                      ContractService contractService, MeterRepository meterRepository, OfficeRepository officeRepository, ContractRepository contractRepository, UserRepository userRepository, CustomerRepository customerRepository, ContactRepository contactRepository) {
        this.meterService = meterService;
        this.contractService = contractService;
        this.meterRepository = meterRepository;
        this.officeRepository = officeRepository;
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.contactRepository = contactRepository;
    }

    public Integer getContactIdFromMeterId(Integer meterId) {
        // Tìm Meter, nếu không tồn tại thì ném ngoại lệ
        Meter meter = meterRepository.findById(meterId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Meter not found"));

        // Kiểm tra Office của Meter
        Office office = meter.getOffice();
        if (office == null || office.getContracts() == null || office.getContracts().isEmpty()) {
            throw new APIException(HttpStatus.NOT_FOUND, "Không tìm thấy hợp đồng nào cho văn phòng");
        }

        // Lấy Contract đầu tiên
        Contract contract = office.getContracts().get(0);
        if (contract == null || contract.getCustomer() == null || contract.getCustomer().getUser() == null) {
            throw new APIException(HttpStatus.NOT_FOUND, "Không tìm thấy Khách hàng cho hợp đồng");
        }

        // Trả về User ID
        return contract.getCustomer().getUser().getId();
    }
}
