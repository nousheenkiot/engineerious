package com.nous.cohortservice.service;

import io.awspring.cloud.s3.S3Template;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@Profile({ "qa", "stg", "prod" })
public class S3StorageService implements StorageService {

    private final S3Template s3Template;

    @Value("${app.aws.s3.bucket:finance-documents}")
    private String bucket;

    public S3StorageService(S3Template s3Template) {
        this.s3Template = s3Template;
    }

    @Override
    public void store(String key, InputStream data, String contentType) {
        s3Template.upload(bucket, key, data);
    }

    @Override
    public InputStream retrieve(String key) {
        try {
            return s3Template.download(bucket, key).getInputStream();
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve file from S3", e);
        }
    }

    @Override
    public String getStorageType() {
        return "AWS S3 Storage";
    }
}
