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

    public String discountingByFyDate(LocalDate fyDate) {
        logger.info("Starting discounting process for FY Date: {}", fyDate);

        // 1. Call policy loader
        String policyLoaderResult = cohortServiceClient.loadPolicies(fyDate);
        logger.info("Policy Loader Result: {}", policyLoaderResult);

        // 2. Scheduler check by calling get policy service by fic date (assuming fyDate
        // is used as ficDate)
        String schedulerCheckResult = cohortServiceClient.getPoliciesByFicDate(fyDate);
        logger.info("Scheduler Check Result: {}", schedulerCheckResult);

        // 3. Call cashflow loader
        String cashflowLoaderResult = cohortServiceClient.loadCashflows();
        logger.info("Cashflow Loader Result: {}", cashflowLoaderResult);

        return String.format("Process completed for FY Date %s. Results: [%s, %s, %s]",
                fyDate, policyLoaderResult, schedulerCheckResult, cashflowLoaderResult);
    }
}
