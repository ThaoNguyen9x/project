package com.building_mannager_system.component;

import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.repository.Contract.ContractRepository;
import com.building_mannager_system.utils.exception.APIException;
import com.hellosign.sdk.HelloSignClient;
import com.hellosign.sdk.HelloSignException;
import com.hellosign.sdk.resource.SignatureRequest;
import com.hellosign.sdk.resource.TemplateSignatureRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DropboxSignEmailService {

    private final ContractRepository contractRepository;

    @Value("${HS_API_KEY}")
    private String hsApiKey;

    @Value("${HS_TEMPLATE_ID}")
    private String hsTemplateId;

    public DropboxSignEmailService(ContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    public SignatureRequest sendEmailSignatureRequestUsingContract(int id) throws HelloSignException {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + id));

        if (contract.getCustomer().getEmail() == null || contract.getCustomer().getEmail().isEmpty()) {
            System.err.println("Email của khách hàng là null hoặc rỗng.");
            throw new APIException(HttpStatus.BAD_REQUEST, "Email của khách hàng không hợp lệ.");
        }

        if (contract.getCustomer().getDirectorName() == null || contract.getCustomer().getDirectorName().isEmpty()) {
            System.err.println("Tên của khách hàng là null hoặc rỗng.");
            throw new APIException(HttpStatus.BAD_REQUEST, "Tên của khách hàng không hợp lệ.");
        }

        TemplateSignatureRequest sigRequest = new TemplateSignatureRequest();
        sigRequest.setTemplateId(hsTemplateId);
        sigRequest.setSigner("Customer", contract.getCustomer().getEmail(), contract.getCustomer().getDirectorName());
        sigRequest.setTestMode(true); // Loại bỏ nếu muốn gửi email thật

        Map<String, String> customFields = new HashMap<>();
        customFields.put("customerName", contract.getCustomer().getDirectorName());
        sigRequest.setCustomFields(customFields);

        HelloSignClient helloSignClient = new HelloSignClient(hsApiKey);
        SignatureRequest newRequest = helloSignClient.sendTemplateSignatureRequest(sigRequest);
        System.out.println("Yêu cầu ký hợp đồng đã được gửi qua email. Request ID: " + newRequest.getId());

        contract.setLeaseStatus("Send");
        contractRepository.save(contract);
        return newRequest;
    }
}