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

    private final Random random = new Random();

    public void loadPolicies() {
        String[] firstNames = { "John", "Jane", "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry" };
        String[] lastNames = { "Doe", "Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White",
                "Harris" };

        java.util.Set<LocalDate> usedDates = new java.util.HashSet<>();

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

            // Random Financial Year (uniqueness check)
            LocalDate fyDate = generateUniqueFyDate(usedDates);
            usedDates.add(fyDate);
            policy.setFyDate(fyDate);

            policyRepository.save(policy);
        }
    }

    private LocalDate generateUniqueFyDate(java.util.Set<LocalDate> usedDates) {
        int year;
        LocalDate date;
        int attempts = 0;
        do {
            year = 2000 + random.nextInt(50); // Random year 2000-2050
            date = LocalDate.of(year, 1, 1);
            attempts++;
            // Avoid infinite loop if all years are taken (unlikely but safe)
            if (attempts > 100)
                break;
        } while (usedDates.contains(date) || policyRepository.existsByFyDate(date));

        return date;
    }
}
