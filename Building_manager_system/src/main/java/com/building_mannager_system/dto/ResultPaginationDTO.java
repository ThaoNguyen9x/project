package com.building_mannager_system.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultPaginationDTO {

    private Meta meta;
    private Object result;

    @Getter
    @Setter
    public static class Meta {

        private int page;

        private int pageSize;

        private int pages;

        private Long total;
    }
}
