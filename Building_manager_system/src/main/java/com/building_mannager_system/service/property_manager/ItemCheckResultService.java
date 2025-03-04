package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultDto;
import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultFlutterDto;
import com.building_mannager_system.entity.property_manager.ItemCheckResult;
import com.building_mannager_system.enums.ResultStatus;
import com.building_mannager_system.mapper.propertiMapper.ItemCheckResultMapper;
import com.building_mannager_system.repository.system_manager.CheckResultRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ItemCheckResultService {
    private final CheckResultRepository itemCheckResultRepository;
    private final ItemCheckResultMapper itemCheckResultMapper;
    private final ModelMapper modelMapper;

    public ItemCheckResultService(CheckResultRepository itemCheckResultRepository,
                                  ItemCheckResultMapper itemCheckResultMapper,
                                  ModelMapper modelMapper) {
        this.itemCheckResultRepository = itemCheckResultRepository;
        this.itemCheckResultMapper = itemCheckResultMapper;
        this.modelMapper = modelMapper;
    }

    // Lấy kết quả kiểm tra theo checkItemId với phân trang
    public Page<CheckResultFlutterDto> getResultsByCheckItemId(Long checkItemId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("checkedAt").descending());
        Page<ItemCheckResult> resultsPage = itemCheckResultRepository.findByItemCheckId(checkItemId, pageable);

        // Chuyển đổi từ Page<Entity> sang Page<DTO>
        return resultsPage.map(itemCheckResultMapper::toDto);
    }

    public Page<CheckResultFlutterDto> getResultsByCheckItemIdPaged(Long checkItemId, int page, int size) {
        Pageable pageable = PageRequest.of(page-1, size,Sort.by("checkedAt").descending());

        Page<ItemCheckResult> resultsPage = itemCheckResultRepository.findByItemCheckId(checkItemId, pageable);

        return resultsPage.map(itemCheckResultMapper::toDto);
    }

    // Thêm mới kết quả kiểm tra
    public CheckResultFlutterDto createResult(CheckResultFlutterDto resultDto) {
        ItemCheckResult result = itemCheckResultMapper.toEntity(resultDto); // Ánh xạ từ DTO sang Entity
        return  itemCheckResultMapper.toDto(itemCheckResultRepository.save(result));
    }

    // Cập nhật kết quả kiểm tra
    public CheckResultFlutterDto updateResult(Long id, CheckResultFlutterDto updatedResultDto) {
        // Lấy kết quả kiểm tra hiện có
        ItemCheckResult existingResult = itemCheckResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found with id: " + id));

        // Cập nhật các trường từ DTO
        existingResult.setResult(ResultStatus.valueOf(updatedResultDto.getResult()));
        existingResult.setNote(updatedResultDto.getNote());
        existingResult.setCheckedAt(updatedResultDto.getCheckedAt());

        // Lưu lại thay đổi
        return itemCheckResultMapper.toDto(itemCheckResultRepository.save(existingResult));
    }

    // Xóa một kết quả kiểm tra
    public void deleteResult(Long id) {
        ItemCheckResult result = itemCheckResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found with id: " + id));
        itemCheckResultRepository.delete(result);
    }

    public CheckResultFlutterDto getResultById(Long checkResultId) {
        ItemCheckResult itemCheckResult = itemCheckResultRepository.findById(checkResultId).orElse(null);
        return itemCheckResultMapper.toDto(itemCheckResult);
    }

    public CheckResultDto getResult(Long id) {
        ItemCheckResult result = itemCheckResultRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Result not found with ID: " + id));
        return modelMapper.map(result, CheckResultDto.class); // Map từ Entity sang DTO
    }
}