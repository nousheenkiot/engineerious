package com.nous.processingservice.model;

import java.io.Serializable;
import java.time.LocalDate;

public class Cashflow implements Serializable {
    private Long id;
    private String contractId; // Unit of Account/Policy Number
    private Double amount;
    private String currency;
    private LocalDate cashflowDate;
    private String assumptionType;
    private String status;

    public Cashflow() {
    }

    public Cashflow(Long id, String contractId, Double amount, String currency, LocalDate cashflowDate,
            String assumptionType, String status) {
        this.id = id;
        this.contractId = contractId;
        this.amount = amount;
        this.currency = currency;
        this.cashflowDate = cashflowDate;
        this.assumptionType = assumptionType;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getCashflowDate() {
        return cashflowDate;
    }

    public void setCashflowDate(LocalDate cashflowDate) {
        this.cashflowDate = cashflowDate;
    }

    public String getAssumptionType() {
        return assumptionType;
    }

    public void setAssumptionType(String assumptionType) {
        this.assumptionType = assumptionType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Cashflow{" +
                "id=" + id +
                ", contractId='" + contractId + '\'' +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", cashflowDate=" + cashflowDate +
                ", assumptionType='" + assumptionType + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
