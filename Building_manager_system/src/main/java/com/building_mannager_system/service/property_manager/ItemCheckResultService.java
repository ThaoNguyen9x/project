package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.CheckResultDto;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.property_manager.ItemCheck;
import com.building_mannager_system.entity.property_manager.ItemCheckResult;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.system_manager.CheckResultRepository;
import com.building_mannager_system.repository.system_manager.ItemCheckRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemCheckResultService {
    private final CheckResultRepository itemCheckResultRepository;
    private final ModelMapper modelMapper;
    private final ItemCheckRepository itemCheckRepository;
    private final UserRepository userRepository;

    public ItemCheckResultService(CheckResultRepository itemCheckResultRepository,
                                  ModelMapper modelMapper, ItemCheckRepository itemCheckRepository, UserRepository userRepository) {
        this.itemCheckResultRepository = itemCheckResultRepository;
        this.modelMapper = modelMapper;
        this.itemCheckRepository = itemCheckRepository;
        this.userRepository = userRepository;
    }

    public ResultPaginationDTO getAllResults(Specification<ItemCheckResult> spec,
                                                       Pageable pageable) {

        Page<ItemCheckResult> page = itemCheckResultRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<CheckResultDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, CheckResultDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    // Lấy kết quả kiểm tra theo checkItemId với phân trang
    public ResultPaginationDTO getResultsByCheckItemId(Long checkItemId, Specification<ItemCheckResult> spec,
                                                          Pageable pageable) {

        ItemCheck itemCheck = itemCheckRepository.findById(checkItemId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Item check not found with ID: " + checkItemId));

        Specification<ItemCheckResult> finalSpec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("itemCheck").get("id"), checkItemId)
        );

        Page<ItemCheckResult> page = itemCheckResultRepository.findAll(finalSpec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<CheckResultDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, CheckResultDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public CheckResultDto getResult(Long id) {
        ItemCheckResult ex = itemCheckResultRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Item check result not found with ID: " + id));

        return modelMapper.map(ex, CheckResultDto.class);
    }

    // Thêm mới kết quả kiểm tra
    public CheckResultDto createResult(ItemCheckResult itemCheckResult) {
        // Check Item Check
        if (itemCheckResult.getItemCheck() != null) {
            ItemCheck itemCheck = itemCheckRepository.findById(itemCheckResult.getItemCheck().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Item check not found with ID: " + itemCheckResult.getItemCheck().getId()));
            itemCheckResult.setItemCheck(itemCheck);
        }

        // Check Technician
        if (itemCheckResult.getTechnician() != null) {
            User user = userRepository.findById(itemCheckResult.getTechnician().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Technician not found with ID: " + itemCheckResult.getTechnician().getId()));
            itemCheckResult.setTechnician(user);
        }

        return modelMapper.map(itemCheckResultRepository.save(itemCheckResult), CheckResultDto.class);
    }

    // Cập nhật kết quả kiểm tra
    public CheckResultDto updateResult(Long id, ItemCheckResult itemCheckResult) {
        ItemCheckResult ex = itemCheckResultRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Result check not found with ID: " + id));

        // Check Item Check
        if (itemCheckResult.getItemCheck() != null) {
            ItemCheck itemCheck = itemCheckRepository.findById(itemCheckResult.getItemCheck().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Item check not found with ID: " + itemCheckResult.getItemCheck().getId()));
            itemCheckResult.setItemCheck(itemCheck);
        }

        // Check Technician
        if (itemCheckResult.getTechnician() != null) {
            User user = userRepository.findById(itemCheckResult.getTechnician().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Technician not found with ID: " + itemCheckResult.getTechnician().getId()));
            itemCheckResult.setTechnician(user);
        }

        ex.setCheckedAt(itemCheckResult.getCheckedAt());
        ex.setResult(itemCheckResult.getResult());
        ex.setNote(itemCheckResult.getNote());
        ex.setTechnician(itemCheckResult.getTechnician());
        ex.setItemCheck(itemCheckResult.getItemCheck());

        return modelMapper.map(itemCheckResultRepository.save(ex), CheckResultDto.class);
    }

    // Xóa một kết quả kiểm tra
    public void deleteResults(Long id) {
        ItemCheckResult ex = itemCheckResultRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Result check not found with ID: " + id));

        itemCheckResultRepository.delete(ex);
    }
}
