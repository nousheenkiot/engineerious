package com.nous.cohortservice.service.impl;

import com.nous.cohortservice.entity.Policy;
import com.nous.cohortservice.repository.PolicyRepository;
import com.nous.cohortservice.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PolicyServiceImpl implements PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Override
    public Policy getPolicyById(Long id) {
        Optional<Policy> policy = policyRepository.findById(id);
        return policy.orElse(null); // or throw custom exception
    }

    @Override
    public Policy createPolicy(Policy policy) {
        // Ensure this is treated as a new entity
        policy.setId(null);
        policy.setVersion(null);
        return policyRepository.save(policy);
    }

    @Override
    public void deletePolicy(Long id) {
        policyRepository.deleteById(id);
    }

    @Override
    public List<Policy> getAllPolicies() {
        List<Policy> policyList = policyRepository.findAll();
        return policyList;
    }

    @Override
    public Policy updatePolicy(Long id, Policy policy) {
        Optional<Policy> existingPolicyOpt = policyRepository.findById(id);
        if (existingPolicyOpt.isPresent()) {
            Policy existingPolicy = existingPolicyOpt.get();
            existingPolicy.setPolicyNumber(policy.getPolicyNumber());
            existingPolicy.setHolderName(policy.getHolderName());
            existingPolicy.setPremium(policy.getPremium());
            // We do not update ID or Version manually
            return policyRepository.save(existingPolicy);
        }
        return null; // Or throw ResourceNotFoundException
    }

    @Override
    public void deleteAllPolicies() {
        policyRepository.deleteAll();
    }
}