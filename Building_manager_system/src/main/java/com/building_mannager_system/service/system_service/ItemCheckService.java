package com.building_mannager_system.service.system_service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckDto;
import com.building_mannager_system.entity.property_manager.ItemCheck;
import com.building_mannager_system.repository.system_manager.CheckResultRepository;
import com.building_mannager_system.repository.system_manager.ItemCheckRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemCheckService {

    private final ItemCheckRepository itemCheckRepository;
    private final CheckResultRepository checkResultRepository;
    private final ModelMapper modelMapper;

    public ItemCheckService(ItemCheckRepository itemCheckRepository,
                            CheckResultRepository checkResultRepository,

                            ModelMapper modelMapper) {
        this.itemCheckRepository = itemCheckRepository;
        this.checkResultRepository = checkResultRepository;

        this.modelMapper = modelMapper;
    }

    public ResultPaginationDTO getAllItemChecksByDeviceId(Long deviceId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<ItemCheck> itemCheckPage = itemCheckRepository.findAllByDevice_DeviceId(deviceId, pageable);

        // Tạo đối tượng chứa kết quả phân trang
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        // Thiết lập thông tin phân trang
        meta.setPage(page);
        meta.setPageSize(size);
        meta.setPages(itemCheckPage.getTotalPages());
        meta.setTotal(itemCheckPage.getTotalElements());

        // Chuyển đổi danh sách từ ItemCheck sang ItemCheckDto
        List<ItemCheckDto> list = itemCheckPage.getContent()
                .stream()
                .map(itemCheck -> modelMapper.map(itemCheck, ItemCheckDto.class))
                .collect(Collectors.toList());

        // Thiết lập dữ liệu vào ResultPaginationDTO
        rs.setMeta(meta);
        rs.setResult(list);

        return rs;
    }



    @Transactional
    public ItemCheckDto createItemCheck(ItemCheckDto itemCheckDto) {
        // Chuyển đổi từ DTO sang Entity bằng ModelMapper
        ItemCheck itemCheck = modelMapper.map(itemCheckDto, ItemCheck.class);

        // Lưu vào database
        itemCheck = itemCheckRepository.save(itemCheck);

        // Chuyển đổi từ Entity sang DTO trước khi trả về
        return modelMapper.map(itemCheck, ItemCheckDto.class);
    }


    // Lấy chi tiết một mục kiểm tra theo ID
    public ItemCheckDto getItemCheckById(Long id) {
        ItemCheck itemCheck = itemCheckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemCheck not found with id: " + id));

        // Chuyển đổi từ Entity sang DTO bằng ModelMapper
        return modelMapper.map(itemCheck, ItemCheckDto.class);
    }

    @Transactional
    public ItemCheckDto updateItemCheck(Long id, ItemCheckDto updatedItemCheckDto) {
        ItemCheck existingItemCheck = itemCheckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemCheck not found with id: " + id));

        // Chuyển đổi DTO thành entity và cập nhật thông tin (không ghi đè ID)
        modelMapper.map(updatedItemCheckDto, existingItemCheck);

        // Lưu lại bản ghi đã cập nhật
        existingItemCheck = itemCheckRepository.save(existingItemCheck);

        // Trả về DTO sau khi cập nhật
        return modelMapper.map(existingItemCheck, ItemCheckDto.class);
    }

    // Xóa một mục kiểm tra
    @Transactional
    public void deleteItemCheck(Long id) {
        ItemCheck itemCheck = itemCheckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemCheck not found with id: " + id));

        if (checkResultRepository.existsByItemCheckId(id)) {
            checkResultRepository.deleteByItemCheckId(id);
        }

        itemCheckRepository.delete(itemCheck);
    }
}
