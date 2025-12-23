package com.nous.cohortservice.service;

import java.io.InputStream;

public interface StorageService {
    void store(String key, InputStream data, String contentType);

    InputStream retrieve(String key);

    String getStorageType();
}
