package com.nous.cohortservice.service;

import com.nous.cohortservice.entity.Policy;
import com.nous.cohortservice.enums.PolicyAssumption;
import com.nous.cohortservice.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Random;
import java.util.UUID;

@Service
public class PolicyLoaderService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private final Random random = new Random();

    public void loadPolicies(LocalDate fyDate) {
        String[] firstNames = { "John", "Jane", "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry" };
        String[] lastNames = { "Doe", "Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White",
                "Harris" };

        for (int i = 0; i < 20; i++) {
            Policy policy = new Policy();

            // Random Name
            String fName = firstNames[random.nextInt(firstNames.length)];
            String lName = lastNames[random.nextInt(lastNames.length)];
            policy.setHolderName(fName + " " + lName);

            // Random Policy Number
            policy.setPolicyNumber(UUID.randomUUID().toString());

            // Random Premium
            policy.setPremium(1000 + (10000 - 1000) * random.nextDouble());

            // Random Assumption
            PolicyAssumption[] assumptions = PolicyAssumption.values();
            policy.setAssumption(assumptions[random.nextInt(assumptions.length)]);

            policy.setFyDate(fyDate);

            policyRepository.save(policy);

            try {
                String policyJson = objectMapper.writeValueAsString(policy);
                kafkaProducerService.sendMessage("policy-events", policy.getPolicyNumber(), policyJson);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
