package com.nous.cohortservice.entity;

import com.nous.cohortservice.enums.PolicyAssumption;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cashflows")
public class Cashflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double financeAmount;
    private String policyNumber;
    private LocalDate fyDate;
    private LocalDate cashflowDate;

    @Enumerated(EnumType.STRING)
    private PolicyAssumption assumption;

    public Cashflow() {
    }

    public Cashflow(Long id, Double financeAmount, String policyNumber, LocalDate fyDate, LocalDate cashflowDate,
            PolicyAssumption assumption) {
        this.id = id;
        this.financeAmount = financeAmount;
        this.policyNumber = policyNumber;
        this.fyDate = fyDate;
        this.cashflowDate = cashflowDate;
        this.assumption = assumption;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getFinanceAmount() {
        return financeAmount;
    }

    public void setFinanceAmount(Double financeAmount) {
        this.financeAmount = financeAmount;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public LocalDate getFyDate() {
        return fyDate;
    }

    public void setFyDate(LocalDate fyDate) {
        this.fyDate = fyDate;
    }

    public LocalDate getCashflowDate() {
        return cashflowDate;
    }

    public void setCashflowDate(LocalDate cashflowDate) {
        this.cashflowDate = cashflowDate;
    }

    public PolicyAssumption getAssumption() {
        return assumption;
    }

    public void setAssumption(PolicyAssumption assumption) {
        this.assumption = assumption;
    }
}
