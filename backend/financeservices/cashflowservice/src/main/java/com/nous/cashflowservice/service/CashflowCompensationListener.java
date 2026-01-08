package com.nous.cashflowservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CashflowCompensationListener {

    private static final Logger log = LoggerFactory.getLogger(CashflowCompensationListener.class);

    @Autowired
    private CashflowSagaService cashflowSagaService;

    @KafkaListener(topics = "csm-update-failed", groupId = "cashflow-group")
    public void handleCsmUpdateFailed(Map<String, Object> errorDetails) {
        String contractId = (String) errorDetails.get("contractId");
        String reason = (String) errorDetails.get("reason");

        log.error("Received failure signal from Cohort Service for contract: {}. Triggering compensation.", contractId);
        cashflowSagaService.compensateCashflow(contractId, reason);
    }
}
