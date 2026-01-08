package com.nous.cashflowservice.dto;

import java.time.LocalDate;

public class CashflowRecordedEvent {
    private String transactionId; // Unique ID for this Saga instance
    private String contractId;
    private Double amount;
    private String assumptionType;
    private LocalDate cashflowDate;
    private String status;

    public CashflowRecordedEvent() {
    }

    public CashflowRecordedEvent(String transactionId, String contractId, Double amount, String assumptionType,
            LocalDate cashflowDate, String status) {
        this.transactionId = transactionId;
        this.contractId = contractId;
        this.amount = amount;
        this.assumptionType = assumptionType;
        this.cashflowDate = cashflowDate;
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getContractId() {
        return contractId;
    }

    public void setContractId(String contractId) {
        this.contractId = contractId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getAssumptionType() {
        return assumptionType;
    }

    public void setAssumptionType(String assumptionType) {
        this.assumptionType = assumptionType;
    }

    public LocalDate getCashflowDate() {
        return cashflowDate;
    }

    public void setCashflowDate(LocalDate cashflowDate) {
        this.cashflowDate = cashflowDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
