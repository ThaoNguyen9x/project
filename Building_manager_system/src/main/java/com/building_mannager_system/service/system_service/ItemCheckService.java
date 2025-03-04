package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultFlutterDto;
import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckDto;
import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckFlutterDto;
import com.building_mannager_system.entity.property_manager.ItemCheck;
import com.building_mannager_system.entity.property_manager.ItemCheckResult;
import com.building_mannager_system.mapper.propertiMapper.ItemCheckMapper;
import com.building_mannager_system.repository.system_manager.CheckResultRepository;
import com.building_mannager_system.repository.system_manager.ItemCheckRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ItemCheckService {

    private final ItemCheckRepository itemCheckRepository;
    private final ItemCheckMapper itemCheckMapper;
    private final CheckResultRepository checkResultRepository;
    private final ModelMapper modelMapper;

    public ItemCheckService(ItemCheckRepository itemCheckRepository,
                            ItemCheckMapper itemCheckMapper,
                            CheckResultRepository checkResultRepository,
                            ModelMapper modelMapper) {
        this.itemCheckRepository = itemCheckRepository;
        this.itemCheckMapper = itemCheckMapper;
        this.checkResultRepository = checkResultRepository;
        this.modelMapper = modelMapper;
    }

    // Lấy tất cả các mục kiểm tra theo deviceId
    public Page<ItemCheckFlutterDto> getAllItemChecksByDeviceId(Long deviceId, int page, int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<ItemCheck> itemCheckPage = itemCheckRepository.findAllByDevice_DeviceId(deviceId, pageable);

        // Chuyển đổi từ Page<Entity> sang Page<DTO>
        return itemCheckPage.map(itemCheckMapper::toDto);
    }

    // Thêm mới một mục kiểm tra
    public ItemCheckFlutterDto createItemCheck(ItemCheckFlutterDto itemCheckDto) {
        // Map từ DTO sang Entity
        ItemCheck itemCheck = itemCheckMapper.toEntity(itemCheckDto);

        return itemCheckMapper.toDto(itemCheckRepository.save(itemCheck));
    }

    // Cập nhật mục kiểm tra
    public ItemCheck updateItemCheck(Long id, ItemCheckFlutterDto updatedItemCheckDto) {
        // Lấy mục kiểm tra hiện có từ database
        ItemCheck existingItemCheck = itemCheckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemCheck not found with id: " + id));

        // Map dữ liệu từ DTO sang Entity
        ItemCheck updatedItemCheck = itemCheckMapper.toEntity(updatedItemCheckDto);
        existingItemCheck.setCheckCategory(updatedItemCheck.getCheckCategory());
        existingItemCheck.setCheckName(updatedItemCheck.getCheckName());
        existingItemCheck.setStandard(updatedItemCheck.getStandard());
        existingItemCheck.setFrequency(updatedItemCheck.getFrequency());

        return itemCheckRepository.save(existingItemCheck);
    }

    // Xóa một mục kiểm tra
    @Transactional
    public void deleteItemCheck(Long id) {
        // Tìm mục kiểm tra theo ID, nếu không tìm thấy thì ném ngoại lệ
        ItemCheck itemCheck = itemCheckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemCheck not found with id: " + id));

        // Kiểm tra xem có kết quả kiểm tra hay không
        if (checkResultRepository.existsByItemCheckId(id)) {
            checkResultRepository.deleteByItemCheckId(id);
        }

        // Xóa mục kiểm tra sau khi xóa hết kết quả liên quan
        itemCheckRepository.delete(itemCheck);
    }

    public ItemCheckDto getItemCheck(Long id) {
        ItemCheck itemCheck = itemCheckRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "ItemCheck not found with ID: " + id));
        return modelMapper.map(itemCheck, ItemCheckDto.class); // Map từ Entity sang DTO
    }

    public ItemCheckFlutterDto getItemCheckById(Long id) {
        ItemCheck itemCheck = itemCheckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemCheck not found with id: " + id));
        return itemCheckMapper.toDto(itemCheck); // Map từ Entity sang DTO
    }

}
