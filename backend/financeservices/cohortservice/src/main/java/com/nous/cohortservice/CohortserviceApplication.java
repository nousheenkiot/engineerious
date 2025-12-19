package com.nous.cohortservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import java.util.TimeZone;

@SpringBootApplication
@EnableDiscoveryClient
public class CohortserviceApplication {

	public static void main(String[] args) {
		// Fix for Windows timezone issue (Asia/Calcutta -> Asia/Kolkata)
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));

		SpringApplication.run(CohortserviceApplication.class, args);
	}

}
