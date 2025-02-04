package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultDto;
import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckDto;
import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckWithResultsDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ItemCheckWithResultsService {
    private final ItemCheckService itemCheckService;
    private final ItemCheckResultService checkResultService;

    public ItemCheckWithResultsService(ItemCheckService itemCheckService, ItemCheckResultService checkResultService) {
        this.itemCheckService = itemCheckService;
        this.checkResultService = checkResultService;
    }



//    public List<ItemCheckWithResultsDto> getAllItemChecksWithResultsByDeviceId(Long deviceId, int page, int size) {
//        Page<ItemCheckDto> itemChecks = itemCheckService.getAllItemChecksByDeviceId(deviceId, page, size);
//        List<ItemCheckWithResultsDto> resultList = new ArrayList<>();
//
//        for (ItemCheckDto item : itemChecks) {
//            Page<CheckResultDto> resultsPage = checkResultService.getResultsByCheckItemIdPaged(item.getId(), page, size);
//
//            ItemCheckWithResultsDto dto = new ItemCheckWithResultsDto(
//                    item.getId(),
//                    item.getCheckName(),
//                    item.getCheckCategory(),
//                    item.getStandard(),
//                    item.getFrequency(),
//                    resultsPage.getContent(),  // Danh sách kết quả theo trang
//                    resultsPage.getTotalPages(),  // Tổng số trang
//                    resultsPage.getTotalElements() // Tổng số phần tử
//            );
//            resultList.add(dto);
//        }
//
//        return resultList;
//    }
}

