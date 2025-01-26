package com.building_mannager_system.controller;

import com.building_mannager_system.dto.requestDto.UploadFileDto;
import com.building_mannager_system.service.ConfigService.FileService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.building_mannager_system.utils.exception.APIException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Value("${upload-file.base-uri}")
    private String baseURI;

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping
    @ApiMessage("Upload file")
    public ResponseEntity<List<UploadFileDto>> upload(@RequestParam(name = "file", required = false) List<MultipartFile> file,
                                                @RequestParam("folder") String folder) throws URISyntaxException, IOException {

        List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx", "rar");
        List<UploadFileDto> responses = new ArrayList<>();

        fileService.createDirectory(baseURI + folder);

        for (MultipartFile send : file) {
            String fileName = send.getOriginalFilename();
            boolean isValid = allowedExtensions.stream().anyMatch(ext -> fileName.toLowerCase().endsWith(ext));

            if (!isValid) {
                throw new APIException(HttpStatus.BAD_REQUEST, "Invalid file extension for " + fileName + ". Only allows " + allowedExtensions);
            }

            // Store file
            String uploadFile = fileService.store(send, folder);
            responses.add(new UploadFileDto(uploadFile, LocalDateTime.now()));
        }

        return ResponseEntity.ok().body(responses);
    }

    @GetMapping
    @ApiMessage("Download a file")
    public ResponseEntity<Resource> download(@RequestParam(name = "fileName", required = false) String fileName,
                                             @RequestParam(name = "folder", required = false) String folder) throws URISyntaxException, FileNotFoundException {
        if (fileName == null || folder == null)
            throw new APIException(HttpStatus.BAD_REQUEST, "Missing required params : (fileName or folder) in query params.");

        // Check if file exists (and is not a directory)
        long fileLength = fileService.getFileLength(fileName, folder);
        if (fileLength == 0)
            throw new APIException(HttpStatus.NOT_FOUND, "File with name = " + fileName + " not found.");

        // Download the file
        InputStreamResource resource = fileService.getResource(fileName, folder);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentLength(fileLength)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
