package com.nous.cohortservice.service;

import com.nous.cohortservice.entity.Cashflow;
import com.nous.cohortservice.entity.Policy;
import com.nous.cohortservice.enums.PolicyAssumption;
import com.nous.cohortservice.repository.CashflowRepository;
import com.nous.cohortservice.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class CashflowService {

    @Autowired
    private CashflowRepository cashflowRepository;

    @Autowired
    private PolicyRepository policyRepository;

    private final Random random = new Random();

    public List<Cashflow> getAllCashflows() {
        return cashflowRepository.findAll();
    }

    public Cashflow saveCashflow(Cashflow cashflow) {
        return cashflowRepository.save(cashflow);
    }

    public void deleteCashflow(Long id) {
        cashflowRepository.deleteById(id);
    }

    @Transactional
    public void deleteCashflowsByFyDate(LocalDate fyDate) {
        cashflowRepository.deleteByFyDate(fyDate);
    }

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public void loadCashflows() {
        List<Policy> policies = policyRepository.findAll();
        if (policies.isEmpty()) {
            throw new RuntimeException("No policies available to generate cashflows.");
        }

        int count = 0;
        int attempts = 0;
        // Keep track of what we added in this transaction to avoid duplicates within
        // the same batch
        // Key: policyNumber + assumption
        java.util.Set<String> addedKeys = new java.util.HashSet<>();

        while (count < 100 && attempts < 1000) {
            attempts++;

            // Pick a random policy
            Policy randomPolicy = policies.get(random.nextInt(policies.size()));

            // Random Assumption
            PolicyAssumption[] assumptions = PolicyAssumption.values();
            PolicyAssumption assumption = assumptions[random.nextInt(assumptions.length)];

            String duplicationKey = randomPolicy.getPolicyNumber() + "-" + randomPolicy.getFyDate() + "-" + assumption;

            // Check if exists in DB or in current batch
            if (addedKeys.contains(duplicationKey) ||
                    cashflowRepository.existsByPolicyNumberAndFyDateAndAssumption(
                            randomPolicy.getPolicyNumber(), randomPolicy.getFyDate(), assumption)) {
                continue;
            }

            Cashflow cashflow = new Cashflow();
            cashflow.setPolicyNumber(randomPolicy.getPolicyNumber());
            cashflow.setFyDate(randomPolicy.getFyDate());

            // Random Finance Amount
            cashflow.setFinanceAmount(500 + (5000 - 500) * random.nextDouble());

            cashflow.setAssumption(assumption);

            // Random Cashflow Date within the Financial Year
            LocalDate fyStart = randomPolicy.getFyDate();
            cashflow.setCashflowDate(fyStart.plusDays(random.nextInt(365)));

            cashflowRepository.save(cashflow);
            addedKeys.add(duplicationKey);
            count++;
        }

        // Send Kafka Message
        try {
            java.util.List<java.util.Map<String, Object>> messagePayload = new java.util.ArrayList<>();
            for (Policy p : policies) {
                java.util.Map<String, Object> item = new java.util.HashMap<>();
                item.put("policyNumber", p.getPolicyNumber());
                item.put("fyDate", p.getFyDate().toString());
                messagePayload.add(item);
            }
            String jsonMessage = objectMapper.writeValueAsString(messagePayload);
            kafkaProducerService.sendMessage("cashflow-loaded", jsonMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
