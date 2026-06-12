package com.nous.cashflowservice.service;

import com.nous.cashflowservice.dto.CashflowRecordedEvent;
import com.nous.cashflowservice.entity.Cashflow;
import com.nous.cashflowservice.entity.CashflowStatus;
import com.nous.cashflowservice.repository.CashflowRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.kafka.support.SendResult;
import java.util.concurrent.ExecutionException;
import java.util.UUID;

@Service
public class CashflowSagaService {

    private static final Logger log = LoggerFactory.getLogger(CashflowSagaService.class);

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
        CashflowRecordedEvent event = new CashflowRecordedEvent(
                UUID.randomUUID().toString(),
                saved.getContractId(),
                saved.getAmount(),
                saved.getAssumptionType(),
                saved.getCashflowDate(),
                "RECORDED");

        // 3. Emit Event - Using ContractId as Key for Ordering
        try {
            SendResult<String, Object> result = kafkaTemplate.send("cashflow-recorded", saved.getContractId(), event).get();
            log.info("Cashflow event emitted successfully for contract: {} (offset: {})", saved.getContractId(), result.getRecordMetadata().offset());
            saved.setStatus(CashflowStatus.SUCCESS);
            cashflowRepository.save(saved);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted while sending cashflow-recorded event for contract: {}", saved.getContractId(), e);
            saved.setStatus(CashflowStatus.FAILED);
            cashflowRepository.save(saved);
        } catch (ExecutionException e) {
            log.error("Failed to send cashflow-recorded event for contract: {} due to: {}", saved.getContractId(), e.getCause().getMessage(), e.getCause());
            saved.setStatus(CashflowStatus.FAILED);
            cashflowRepository.save(saved);
        } catch (Exception e) {
            log.error("Unexpected error while sending cashflow-recorded event for contract: {}", saved.getContractId(), e);
            saved.setStatus(CashflowStatus.FAILED);
            cashflowRepository.save(saved);
        }

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
