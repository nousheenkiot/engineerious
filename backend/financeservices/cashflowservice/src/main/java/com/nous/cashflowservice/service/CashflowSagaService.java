package com.nous.cashflowservice.service;

import com.nous.cashflowservice.dto.CashflowRecordedEvent;
import com.nous.cashflowservice.entity.Cashflow;
import com.nous.cashflowservice.entity.CashflowStatus;
import com.nous.cashflowservice.repository.CashflowRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
public class CashflowSagaService {

    @Autowired
    private CashflowRepository cashflowRepository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public Cashflow recordCashflow(Cashflow cashflow) {
        log.info("Recording cashflow for contract: {}", cashflow.getContractId());

        // 1. Save to Local DB
        Cashflow saved = cashflowRepository.save(cashflow);

        // 2. Prepare Event
        CashflowRecordedEvent event = CashflowRecordedEvent.builder()
                .transactionId(UUID.randomUUID().toString())
                .contractId(saved.getContractId())
                .amount(saved.getAmount())
                .assumptionType(saved.getAssumptionType())
                .cashflowDate(saved.getCashflowDate())
                .status("RECORDED")
                .build();

        // 3. Emit Event - Using ContractId as Key for Ordering
        kafkaTemplate.send("cashflow-recorded", saved.getContractId(), event);

        log.info("Cashflow event emitted for contract: {}", saved.getContractId());
        return saved;
    }

    @Transactional
    public void compensateCashflow(String contractId, String reason) {
        log.warn("Compensating cashflow for contract: {}. Reason: {}", contractId, reason);
        // In a real scenario, we would find the specific cashflow by transactionId
        // Here we just mark the latest one or all pending for this contract
        cashflowRepository.findLatestByContractId(contractId).ifPresent(cf -> {
            cf.setStatus(CashflowStatus.REVERSED);
            cashflowRepository.save(cf);
            log.info("Cashflow ID {} successfully reversed", cf.getId());
        });
    }
}
