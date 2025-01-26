package com.building_mannager_system.dto.responseDto;

import com.building_mannager_system.dto.requestDto.ContractDto.ContractDto;
import com.building_mannager_system.dto.requestDto.customer.CustomerTypeDocumentDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContractReminderDto {
    private ContractDto contract; // Thông tin hợp đồng
    private List<CustomerTypeDocumentDto> customerTypeDocuments; // Danh sách tài liệu "unactive"
}
