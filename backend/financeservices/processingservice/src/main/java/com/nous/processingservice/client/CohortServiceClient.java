package com.nous.processingservice.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

@Service
public class CohortServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(CohortServiceClient.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.cohortservice.base-url}")
    private String cohortServiceUrl;

    @CircuitBreaker(name = "cohortService", fallbackMethod = "fallbackLoadPolicies")
    @Retry(name = "cohortService")
    @RateLimiter(name = "cohortService")
    public String loadPolicies(LocalDate date) {
        logger.info("Calling cohortservice to load policies for date: {}", date);
        String url = cohortServiceUrl + "/policies/load?date=" + date;
        return restTemplate.postForObject(url, null, String.class);
    }

    @CircuitBreaker(name = "cohortService", fallbackMethod = "fallbackGetPoliciesByFicDate")
    @Retry(name = "cohortService")
    @RateLimiter(name = "cohortService")
    public String getPoliciesByFicDate(LocalDate date) {
        logger.info("Calling cohortservice to get policies by FIC date: {}", date);
        // Assuming this endpoint exists or will be created
        String url = cohortServiceUrl + "/policies/fic?date=" + date;
        return restTemplate.getForObject(url, String.class);
    }

    @CircuitBreaker(name = "cohortService", fallbackMethod = "fallbackLoadCashflows")
    @Retry(name = "cohortService")
    @RateLimiter(name = "cohortService")
    public String loadCashflows() {
        logger.info("Calling cohortservice to load cashflows");
        String url = cohortServiceUrl + "/cashflows/load";
        return restTemplate.postForObject(url, null, String.class);
    }

    // Fallback methods
    public String fallbackLoadPolicies(LocalDate date, Throwable t) {
        logger.error("Fallback for loadPolicies: {}", t.getMessage());
        return "Fallback: Policies could not be loaded for date " + date;
    }

    public String fallbackGetPoliciesByFicDate(LocalDate date, Throwable t) {
        logger.error("Fallback for getPoliciesByFicDate: {}", t.getMessage());
        return "Fallback: Policies could not be retrieved for FIC date " + date;
    }

    public String fallbackLoadCashflows(Throwable t) {
        logger.error("Fallback for loadCashflows: {}", t.getMessage());
        return "Fallback: Cashflows could not be loaded";
    }
}
