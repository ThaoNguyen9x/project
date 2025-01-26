package com.building_mannager_system.service.notification;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.requestDto.notificationDto.MaintenanceTaskDto;
import com.building_mannager_system.entity.Role;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.property_manager.MaintenanceTask;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.notification.MaintenanceTaskRepository;
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
public class MaintenanceTaskService {

    private final MaintenanceTaskRepository maintenanceTaskRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public MaintenanceTaskService(MaintenanceTaskRepository maintenanceTaskRepository,
                                  ModelMapper modelMapper, UserRepository userRepository) {
        this.maintenanceTaskRepository = maintenanceTaskRepository;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    public ResultPaginationDTO getAllMaintenanceTasks(Specification<MaintenanceTask> spec,
                                              Pageable pageable) {

        Page<MaintenanceTask> page = maintenanceTaskRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        List<MaintenanceTaskDto> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, MaintenanceTaskDto.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    public MaintenanceTaskDto createMaintenanceTask(MaintenanceTask maintenanceTask) {
        if (maintenanceTask.getAssignedTo() != null) {
            User user = userRepository.findById(maintenanceTask.getAssignedTo().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + maintenanceTask.getAssignedTo().getId()));
            maintenanceTask.setAssignedTo(user);
        }

        return modelMapper.map(maintenanceTaskRepository.save(maintenanceTask), MaintenanceTaskDto.class);
    }

    public MaintenanceTaskDto getMaintenanceTask(Long id) {
        MaintenanceTask maintenanceTask = maintenanceTaskRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance task not found with ID: " + id));

        return modelMapper.map(maintenanceTask, MaintenanceTaskDto.class);
    }

    public MaintenanceTaskDto updateMaintenanceTask(Long id, MaintenanceTask maintenanceTask) {
        MaintenanceTask ex = maintenanceTaskRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance task not found with ID: " + id));

        if (maintenanceTask.getAssignedTo() != null) {
            User user = userRepository.findById(maintenanceTask.getAssignedTo().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + maintenanceTask.getAssignedTo().getId()));
            maintenanceTask.setAssignedTo(user);
        }

        ex.setTaskName(maintenanceTask.getTaskName());
        ex.setTaskDescription(maintenanceTask.getTaskDescription());
        ex.setMaintenanceType(maintenanceTask.getMaintenanceType());
        ex.setAssignedTo(maintenanceTask.getAssignedTo());
        ex.setAssignedToPhone(maintenanceTask.getAssignedToPhone());
        ex.setExpectedDuration(maintenanceTask.getExpectedDuration());

        return modelMapper.map(maintenanceTaskRepository.save(ex), MaintenanceTaskDto.class);
    }

    public void deleteMaintenanceTask(Long id) {
        MaintenanceTask maintenanceTask = maintenanceTaskRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Maintenance task not found with ID: " + id));

        maintenanceTaskRepository.delete(maintenanceTask);
    }
}
