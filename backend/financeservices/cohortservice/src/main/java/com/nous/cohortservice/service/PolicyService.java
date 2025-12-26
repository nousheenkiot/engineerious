package com.nous.cohortservice.service;

import com.nous.cohortservice.entity.Policy;

import java.util.List;

public interface PolicyService {
    Policy getPolicyById(Long id);

    Policy createPolicy(Policy policy);

    void deletePolicy(Long id);

    List<Policy> getAllPolicies();

    Policy updatePolicy(Long id, Policy policy);

    void deleteAllPolicies();

    List<Policy> getPoliciesByFicDate(java.time.LocalDate ficDate);
}
