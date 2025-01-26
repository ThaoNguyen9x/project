package com.building_mannager_system.dto.responseDto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class ApiResponce<T> {

    private int code;
    private T data;
    private String status;

}
