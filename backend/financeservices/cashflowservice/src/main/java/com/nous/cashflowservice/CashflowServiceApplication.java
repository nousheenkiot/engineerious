package com.nous.cashflowservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableKafka
@EnableDiscoveryClient
public class CashflowServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CashflowServiceApplication.class, args);
    }
}
