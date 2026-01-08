package com.nous.cashflowservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

import java.util.TimeZone;

@SpringBootApplication
@EnableKafka 
public class CashflowServiceApplication {
    public static void main(String[] args) {
        // Fix for Windows timezone issue (Asia/Calcutta -> Asia/Kolkata)
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(CashflowServiceApplication.class, args);
    }
}
