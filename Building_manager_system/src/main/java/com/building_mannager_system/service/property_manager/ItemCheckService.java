package com.building_mannager_system.service.property_manager;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.propertyDto.ItemCheckDto;
import com.building_mannager_system.entity.property_manager.Device;
import com.building_mannager_system.entity.property_manager.ItemCheck;
import com.building_mannager_system.repository.system_manager.DeviceRepository;
import com.building_mannager_system.repository.system_manager.ItemCheckRepository;
import com.building_mannager_system.utils.exception.APIException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemCheckService {

    private final ItemCheckRepository itemCheckRepository;
    private final DeviceRepository deviceRepository;
    private final ModelMapper modelMapper;

    public ItemCheckService(ItemCheckRepository itemCheckRepository,
                            DeviceRepository deviceRepository,
                            ModelMapper modelMapper) {
        this.itemCheckRepository = itemCheckRepository;
        this.deviceRepository = deviceRepository;
        this.modelMapper = modelMapper;
    }

    public ResultPaginationDTO getAllItemChecks(Specification<ItemCheck> spec,
                                                          Pageable pageable) {

        Page<ItemCheck> page = itemCheckRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<ItemCheckDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ItemCheckDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    // Lấy tất cả các mục kiểm tra theo deviceId
    public ResultPaginationDTO getAllItemChecksByDeviceId(Long deviceId, Specification<ItemCheck> spec,
                                           Pageable pageable) {

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + deviceId));

        Specification<ItemCheck> finalSpec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("device").get("id"), deviceId)
        );

        Page<ItemCheck> page = itemCheckRepository.findAll(finalSpec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<ItemCheckDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ItemCheckDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    // Thêm mới một mục kiểm tra
    public ItemCheckDto createItemCheck(ItemCheck itemCheck) {
        if (itemCheck.getDevice() != null) {
            Device device = deviceRepository.findById(itemCheck.getDevice().getDeviceId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + itemCheck.getDevice().getDeviceId()));
            itemCheck.setDevice(device);
        }

        return modelMapper.map(itemCheckRepository.save(itemCheck), ItemCheckDto.class);
    }

    // Lấy chi tiết một mục kiểm tra theo ID
    public ItemCheckDto getItemCheck(Long id) {
        ItemCheck ex = itemCheckRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Item check not found with ID: " + id));

        return modelMapper.map(ex, ItemCheckDto.class);
    }

    // Cập nhật mục kiểm tra
    public ItemCheckDto updateItemCheck(Long id, ItemCheck itemCheck) {
        ItemCheck ex = itemCheckRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Item check not found with ID: " + id));

        if (itemCheck.getDevice() != null) {
            Device device = deviceRepository.findById(itemCheck.getDevice().getDeviceId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Device not found with ID: " + itemCheck.getDevice().getDeviceId()));
            itemCheck.setDevice(device);
        }

        ex.setDevice(itemCheck.getDevice());
        ex.setCheckCategory(itemCheck.getCheckCategory());
        ex.setCheckName(itemCheck.getCheckName());
        ex.setStandard(itemCheck.getStandard());
        ex.setFrequency(itemCheck.getFrequency());

        return modelMapper.map(itemCheckRepository.save(ex), ItemCheckDto.class);
    }

    // Xóa một mục kiểm tra
    public void deleteItemCheck(Long id) {
        ItemCheck ex = itemCheckRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Item check not found with ID: " + id));

        try {
            itemCheckRepository.delete(ex);
        } catch (DataIntegrityViolationException e) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Đang hoạt động không thể xóa");
        }
    }
}
