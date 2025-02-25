package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckDto;
import com.building_mannager_system.entity.property_manager.ItemCheck;
import com.building_mannager_system.entity.property_manager.ItemCheckResult;
import com.building_mannager_system.mapper.propertiMapper.ItemCheckMapper;
import com.building_mannager_system.repository.system_manager.CheckResultRepository;
import com.building_mannager_system.repository.system_manager.ItemCheckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.beans.Transient;
import java.util.List;

@Service
public class ItemCheckService {

    @Autowired
    private final ItemCheckRepository itemCheckRepository;

    @Autowired
    private final ItemCheckMapper itemCheckMapper;

    @Autowired
    private  CheckResultRepository checkResultRepository;

    // Constructor
    public ItemCheckService(ItemCheckRepository itemCheckRepository, ItemCheckMapper itemCheckMapper) {
        this.itemCheckRepository = itemCheckRepository;
        this.itemCheckMapper = itemCheckMapper;
    }

    // Lấy tất cả các mục kiểm tra theo deviceId
    public Page<ItemCheckDto> getAllItemChecksByDeviceId(Long deviceId, int page, int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<ItemCheck> itemCheckPage = itemCheckRepository.findAllByDevice_DeviceId(deviceId, pageable);

        // Chuyển đổi từ Page<Entity> sang Page<DTO>
        return itemCheckPage.map(itemCheckMapper::toDto);
    }

    // Thêm mới một mục kiểm tra
    public ItemCheckDto createItemCheck(ItemCheckDto itemCheckDto) {
        // Map từ DTO sang Entity
        ItemCheck itemCheck = itemCheckMapper.toEntity(itemCheckDto);

        return itemCheckMapper.toDto(itemCheckRepository.save(itemCheck));
    }

    // Lấy chi tiết một mục kiểm tra theo ID
    public ItemCheckDto getItemCheckById(Long id) {
        ItemCheck itemCheck = itemCheckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemCheck not found with id: " + id));
        return itemCheckMapper.toDto(itemCheck); // Map từ Entity sang DTO
    }

    // Cập nhật mục kiểm tra
    public ItemCheck updateItemCheck(Long id, ItemCheckDto updatedItemCheckDto) {
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

}
