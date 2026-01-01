package com.nous.cohortservice.service;

import com.nous.cohortservice.dto.CashflowRecordedEvent;
import com.nous.cohortservice.entity.Policy;
import com.nous.cohortservice.repository.PolicyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class SagaConsumerService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "cashflow-recorded", groupId = "cohort-group")
    @Transactional
    public void handleCashflowRecorded(CashflowRecordedEvent event) {
        log.info("Received cashflow event for contract: {}. Amount: {}", event.getContractId(), event.getAmount());

        try {
            // 1. Find the Policy (Unit of Account)
            Optional<Policy> policyOpt = policyRepository.findByPolicyNumber(event.getContractId());

            if (policyOpt.isEmpty()) {
                throw new RuntimeException("Policy not found: " + event.getContractId());
            }

            Policy policy = policyOpt.get();

            // 2. Validate Assumption (IFRS 17 Rule)
            // Just an example: if assumption doesn't match policy, it's an error
            if (!policy.getAssumption().name().equals(event.getAssumptionType())) {
                log.warn("Assumption mismatch for contract {}. Expected {}, got {}",
                        policy.getPolicyNumber(), policy.getAssumption(), event.getAssumptionType());
                // In IFRS 17, mismatched assumptions might require special handling or
                // rejection
                throw new RuntimeException("Assumption mismatch for IFRS 17 CSM calculation");
            }

            // 3. Update CSM Balance
            // Principle: Inflow increases CSM (simplistic for demo)
            Double oldBalance = policy.getCsmBalance() != null ? policy.getCsmBalance() : 0.0;
            policy.setCsmBalance(oldBalance + event.getAmount());
            policyRepository.save(policy);

            log.info("CSM updated for contract {}. New Balance: {}", policy.getPolicyNumber(), policy.getCsmBalance());

        } catch (Exception e) {
            log.error("Failed to update CSM for contract: {}. Error: {}", event.getContractId(), e.getMessage());

            // 4. Emit Compensation Event
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("contractId", event.getContractId());
            errorDetails.put("transactionId", event.getTransactionId());
            errorDetails.put("reason", e.getMessage());

            // Send failure signal back to Cashflow Service
            kafkaTemplate.send("csm-update-failed", event.getContractId(), errorDetails);
        }
    }
}
