package com.building_mannager_system.mapper.paymentMapper;

import com.building_mannager_system.dto.requestDto.paymentDto.PaymentContractDto;
import com.building_mannager_system.entity.pament_entity.PaymentContract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentContractMapper {
//    // Chuyển từ Payment entity sang PaymentDto
//    @Mapping(source = "contract.id", target = "contractId")  // Lấy contractId từ contract
//    @Mapping(source = "customer.id", target = "customerId")  // Lấy customerId từ customer
//    PaymentContractDto paymentToPaymentDto(PaymentContract payment);  // Tham chiếu Payment entity
//
//    // Chuyển từ PaymentDto sang Payment entity
//    @Mapping(source = "contractId", target = "contract.id")  // Lấy contract từ contractId
//    @Mapping(source = "customerId", target = "customer.id")  // Lấy customer từ customerId
//    PaymentContract paymentDtoToPayment(PaymentContractDto paymentDto);  // Tham chiếu PaymentDto entity
//    // Chuyển danh sách Payment entities sang PaymentContractDtos
//    List<PaymentContractDto> paymentsToPaymentDtos(List<PaymentContract> payments);
}
