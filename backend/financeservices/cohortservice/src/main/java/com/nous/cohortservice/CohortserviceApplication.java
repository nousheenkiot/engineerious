package com.nous.cohortservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import java.util.TimeZone;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.nous.cohortservice.service.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@EnableDiscoveryClient
public class CohortserviceApplication {

	private static final Logger log = LoggerFactory.getLogger(CohortserviceApplication.class);

	public static void main(String[] args) {
		// Fix for Windows timezone issue (Asia/Calcutta -> Asia/Kolkata)
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));

		SpringApplication.run(CohortserviceApplication.class, args);
	}

	@Bean
	CommandLineRunner logStorage(StorageService storageService) {
		return args -> {
			log.info("#### [ACTIVE STORAGE]: " + storageService.getStorageType() + " ####");
		};
	}

}
