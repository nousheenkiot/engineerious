package com.nous.cohortservice.repository;

import com.nous.cohortservice.entity.Cashflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CashflowRepository extends JpaRepository<Cashflow, Long> {
    void deleteByFyDate(LocalDate fyDate);

    List<Cashflow> findByFyDate(LocalDate fyDate);

    boolean existsByPolicyNumberAndFyDateAndAssumption(String policyNumber, LocalDate fyDate,
            com.nous.cohortservice.enums.PolicyAssumption assumption);
}
