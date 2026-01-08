package com.nous.cashflowservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cashflows")
public class Cashflow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contractId; // Unit of Account/Policy Number
    private Double amount;
    private String currency;
    private LocalDate cashflowDate;
    private String assumptionType; // e.g., BEST_ESTIMATE, RISK_ADJUSTMENT

    @Enumerated(EnumType.STRING)
    private CashflowStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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

    public CashflowStatus getStatus() {
        return status;
    }

    public void setStatus(CashflowStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null)
            status = CashflowStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
