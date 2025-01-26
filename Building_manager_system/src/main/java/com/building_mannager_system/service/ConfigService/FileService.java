package com.building_mannager_system.service.ConfigService;

import com.building_mannager_system.utils.exception.APIException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class FileService {

    @Value("${upload-file.base-uri}")
    private String baseURI;

    public void createDirectory(String folder) throws URISyntaxException {
        URI uri = new URI(folder);
        Path path = Paths.get(uri);
        File tmpDir = new File(path.toString());
        if (!tmpDir.isDirectory()) {
            try {
                Files.createDirectory(tmpDir.toPath());
                System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + tmpDir.toPath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
        }

    }

    public String store(MultipartFile file, String folder) throws URISyntaxException, IOException {
        // create unique filename
        String finalName = System.currentTimeMillis() + "-" + file.getOriginalFilename();

        URI uri = new URI(baseURI + folder + "/" + finalName);
        Path path = Paths.get(uri);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path,
                    StandardCopyOption.REPLACE_EXISTING);
        }
        return finalName;
    }

    public void deleteFile(String filePath) throws URISyntaxException {
        Path path = Paths.get(new URI(filePath));
        File file = path.toFile();
        if (file.exists() && !file.isDirectory()) {
            boolean deleted = file.delete();
            if (deleted) {
                System.out.println(">>> Deleted file successfully: " + filePath);
            } else {
                System.err.println(">>> Failed to delete file: " + filePath);
            }
        }
    }

    public void validateFile(MultipartFile file, List<String> allowedExtensions) {
        if (file == null || file.isEmpty()) {
            throw new APIException(HttpStatus.BAD_REQUEST, "File is empty. Please upload a valid file.");
        }
        String fileName = file.getOriginalFilename();
        boolean isValid = allowedExtensions.stream().anyMatch(ext -> fileName.toLowerCase().endsWith(ext));
        if (!isValid) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Invalid file extension. Allowed extensions: " + allowedExtensions);
        }
    }


    public String storeFile(MultipartFile file, String folder) {
        try {
            createDirectory(baseURI + folder);
            return store(file, folder);
        } catch (IOException | URISyntaxException e) {
            throw new APIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error storing file: " + file.getOriginalFilename(), e);
        }
    }

    public long getFileLength(String fileName, String folder) throws URISyntaxException {
        URI uri = new URI(baseURI + folder + "/" + fileName);
        Path path = Paths.get(uri);

        File tmpDir = new File(path.toString());

        // file không tồn tại, hoặc file là 1 director => return 0
        if (!tmpDir.exists() || tmpDir.isDirectory())
            return 0;
        return tmpDir.length();
    }

    public InputStreamResource getResource(String fileName, String folder)
            throws URISyntaxException, FileNotFoundException {
        URI uri = new URI(baseURI + folder + "/" + fileName);
        Path path = Paths.get(uri);

        File file = new File(path.toString());
        return new InputStreamResource(new FileInputStream(file));
    }
}

