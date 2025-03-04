package com.building_mannager_system.dto.requestDto.propertyDto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

@NoArgsConstructor
public class ItemCheckWithResultsDto {
    private Long id;
    private String checkName;
    private String checkCategory;
    private String standard;
    private String frequency;
    private List<CheckResultFlutterDto> results;
    private int totalPages;
    private long totalElements;

    public ItemCheckWithResultsDto(Long id, String checkName, String checkCategory, String standard, String frequency,
                                   List<CheckResultFlutterDto> results, int totalPages, long totalElements) {
        this.id = id;
        this.checkName = checkName;
        this.checkCategory = checkCategory;
        this.standard = standard;
        this.frequency = frequency;
        this.results = results;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }
}