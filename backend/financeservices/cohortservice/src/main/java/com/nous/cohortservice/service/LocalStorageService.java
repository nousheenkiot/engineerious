package com.nous.cohortservice.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@Profile({ "local", "dev", "default" })
public class LocalStorageService implements StorageService {

    private final Path rootLocation = Paths.get("data-storage");

    public LocalStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (Exception e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    @Override
    public void store(String key, InputStream data, String contentType) {
        try {
            Files.copy(data, this.rootLocation.resolve(key), StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            throw new RuntimeException("Failed to store file locally", e);
        }
    }

    @Override
    public InputStream retrieve(String key) {
        try {
            return Files.newInputStream(this.rootLocation.resolve(key));
        } catch (Exception e) {
            throw new RuntimeException("Could not read file locally", e);
        }
    }

    @Override
    public String getStorageType() {
        return "Local Filesystem Storage (No AWS)";
    }
}
