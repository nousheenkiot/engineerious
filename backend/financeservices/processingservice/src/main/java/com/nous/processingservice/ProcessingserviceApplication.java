package com.nous.processingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.util.TimeZone;

@SpringBootApplication
@EnableFeignClients
public class ProcessingserviceApplication {

    public static void main(String[] args) {
        // Fix for Windows timezone issue (Asia/Calcutta -> Asia/Kolkata)
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(ProcessingserviceApplication.class, args);
    }

}
