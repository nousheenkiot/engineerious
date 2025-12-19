package com.nous.processingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ProcessingserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcessingserviceApplication.class, args);
    }

}
