package com.nous.cashflowservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
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
