package com.building_mannager_system.service.payment;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.paymentDto.PaymentContractDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.contact_manager.Contract;
import com.building_mannager_system.entity.customer_service.customer_manager.Customer;
import com.building_mannager_system.entity.pament_entity.PaymentContract;
import com.building_mannager_system.enums.PaymentStatus;
import com.building_mannager_system.repository.Contract.ContractRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.paymentRepository.PaymentContractRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.utils.exception.APIException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentContractService {

    private final PaymentContractRepository paymentContractRepository;
    private final ModelMapper modelMapper;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public PaymentContractService(PaymentContractRepository paymentContractRepository,
                                  ModelMapper modelMapper,
                                  ContractRepository contractRepository,
                                  UserRepository userRepository,
                                  FilterParser filterParser,
                                  FilterSpecificationConverter filterSpecificationConverter) {
        this.paymentContractRepository = paymentContractRepository;
        this.modelMapper = modelMapper;
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.filterParser = filterParser;
        this.filterSpecificationConverter = filterSpecificationConverter;
    }

    public ResultPaginationDTO getAllPaymentContracts(Specification<PaymentContract> spec,
                                                      Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);

        if (user.getRole().getName().equals("USER")) {
            // Adjust the specification to filter contracts based on the user's ID in the associated Customer
            spec = spec.and((root, query, builder) ->
                    builder.equal(root.get("contract").get("customer").get("user").get("id"), user.getId())
            );
        }

        Page<PaymentContract> page = paymentContractRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<PaymentContractDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, PaymentContractDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public PaymentContractDto createPaymentContract(PaymentContract paymentContract) {

        // Check contract
        if (paymentContract.getContract() != null) {
            Contract contract = contractRepository.findById(paymentContract.getContract().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Contract not found with ID: " + paymentContract.getContract().getId()));
            paymentContract.setContract(contract);
        }

        return modelMapper.map(paymentContractRepository.save(paymentContract), PaymentContractDto.class);
    }

    public PaymentContractDto updatePaymentContract(int paymentId, PaymentContract paymentContract) {

        PaymentContract existingContract = paymentContractRepository.findById(paymentId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Payment contract not found with ID: " + paymentId));

        if (paymentContract.getContract() != null && paymentContract.getContract().getId() != null) {
            Contract contract = contractRepository.findById(paymentContract.getContract().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND,
                            "Contract not found with ID: " + paymentContract.getContract().getId()));
            existingContract.setContract(contract);
        }

        existingContract.setPaymentDate(paymentContract.getPaymentDate());
        existingContract.setPaymentAmount(paymentContract.getPaymentAmount());
        existingContract.setPaymentStatus(paymentContract.getPaymentStatus());

        PaymentContract updatedContract = paymentContractRepository.save(existingContract);
        return modelMapper.map(updatedContract, PaymentContractDto.class);
    }


    public void deletePaymentContract(int paymentId) {
        PaymentContract paymentContract = paymentContractRepository.findById(paymentId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Payment contract not found with ID: " + paymentId));

        paymentContractRepository.delete(paymentContract);
    }

    public PaymentContractDto getPaymentContract(int paymentId) {
        PaymentContract paymentContract = paymentContractRepository.findById(paymentId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Payment contract not found with ID: " + paymentId));

        return modelMapper.map(paymentContract, PaymentContractDto.class);
    }

    public ResultPaginationDTO getPaymentContractByCustomer(Pageable pageable) {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User user = userRepository.findByEmail(email);
        if (user == null)
            throw new APIException(HttpStatus.NOT_FOUND, "User not found for email: " + email);

        // Lấy customer từ user
        Customer customer = user.getCustomer();
        if (customer == null)
            throw new APIException(HttpStatus.NOT_FOUND, "No customer associated with user email: " + email);

        FilterNode node = filterParser.parse("email='" + email + "'");
        FilterSpecification<PaymentContract> spec = filterSpecificationConverter.convert(node);
        Page<PaymentContract> pageResume = paymentContractRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageResume.getTotalPages());
        mt.setTotal(pageResume.getTotalElements());

        rs.setMeta(mt);

        List<PaymentContractDto> listResume = pageResume.getContent()
                .stream().map(item -> modelMapper.map(item, PaymentContractDto.class))
                .collect(Collectors.toList());

        rs.setResult(listResume);

        return rs;
    }
}
