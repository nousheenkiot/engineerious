package com.nous.processingservice.service;

import com.nous.processingservice.client.CohortServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(ProcessingService.class);

    @Autowired
    private CohortServiceClient cohortServiceClient;

    @Autowired
    private com.nous.processingservice.repository.ProcessingRunRepository processingRunRepository;

    public String discountingByFyDate(LocalDate fyDate) {
        logger.info("Starting discounting process for FY Date: {}", fyDate);

        String result;
        String status = "SUCCESS";
        try {
            // 1. Call policy loader
            String policyLoaderResult = cohortServiceClient.loadPolicies(fyDate);
            logger.info("Policy Loader Result: {}", policyLoaderResult);

            // 2. Scheduler check
            String schedulerCheckResult = cohortServiceClient.getPoliciesByFicDate(fyDate);
            logger.info("Scheduler Check Result: {}", schedulerCheckResult);

            // 3. Call cashflow loader
            String cashflowLoaderResult = cohortServiceClient.loadCashflows();
            logger.info("Cashflow Loader Result: {}", cashflowLoaderResult);

            result = String.format("Process completed für FY Date %s. Results: [%s, %s, %s]",
                    fyDate, policyLoaderResult, schedulerCheckResult, cashflowLoaderResult);

            if (result.contains("Fallback")) {
                status = "PARTIAL_SUCCESS";
            }
        } catch (Exception e) {
            logger.error("Error during discounting process", e);
            status = "FAILED";
            result = "Error: " + e.getMessage();
        }

        // Save to DB
        com.nous.processingservice.model.ProcessingRun run = new com.nous.processingservice.model.ProcessingRun(
                fyDate, java.time.LocalDateTime.now(), status, result);
        processingRunRepository.save(run);

        return result;
    }
}
