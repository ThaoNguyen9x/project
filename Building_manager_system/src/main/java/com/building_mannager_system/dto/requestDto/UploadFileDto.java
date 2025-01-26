package com.building_mannager_system.dto.requestDto;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UploadFileDto {
    private String fileName;
    private LocalDateTime uploadedAt;
}

