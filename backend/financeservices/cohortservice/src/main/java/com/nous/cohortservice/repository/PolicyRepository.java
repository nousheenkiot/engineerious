package com.nous.cohortservice.repository;

import com.nous.cohortservice.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    boolean existsByFyDate(LocalDate fyDate);

    java.util.List<Policy> findByFyDate(LocalDate fyDate);

    java.util.Optional<Policy> findByPolicyNumber(String policyNumber);

    Page<Policy> findByHolderNameContainingIgnoreCaseOrPolicyNumberContainingIgnoreCase(String holderName,
            String policyNumber, Pageable pageable);
}