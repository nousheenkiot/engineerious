package com.nous.cohortservice.dto;

import java.time.LocalDate;

public class CashflowRecordedEvent {
    private String transactionId;
    private String contractId; // In cohort service, this maps to policyNumber
    private Double amount;
    private String assumptionType;
    private LocalDate cashflowDate;
    private String status;

    public CashflowRecordedEvent() {
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
