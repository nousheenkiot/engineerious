package com.nous.cashflowservice.repository;

import com.nous.cashflowservice.entity.Cashflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CashflowRepository extends JpaRepository<Cashflow, Long> {
    
    @Query(value = "SELECT * FROM cashflows WHERE contract_id = ?1 ORDER BY created_at DESC LIMIT 1", nativeQuery = true)
    Optional<Cashflow> findLatestByContractId(String contractId);
}
