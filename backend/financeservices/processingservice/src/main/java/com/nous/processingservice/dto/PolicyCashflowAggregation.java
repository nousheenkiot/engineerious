package com.nous.processingservice.dto;

import com.nous.processingservice.model.Policy;
import java.util.ArrayList;
import java.util.List;

public class PolicyCashflowAggregation {
    private Policy policy;
    private List<CashflowRecordedEvent> cashflows = new ArrayList<>();
    private Double totalCashflowAmount = 0.0;

    public PolicyCashflowAggregation() {
    }

    public PolicyCashflowAggregation setPolicy(Policy policy) {
        this.policy = policy;
        return this;
    }

    public PolicyCashflowAggregation addCashflow(CashflowRecordedEvent cashflow) {
        this.cashflows.add(cashflow);
        this.totalCashflowAmount += cashflow.getAmount();
        return this;
    }

    public Policy getPolicy() {
        return policy;
    }

    public List<CashflowRecordedEvent> getCashflows() {
        return cashflows;
    }

    public void setCashflows(List<CashflowRecordedEvent> cashflows) {
        this.cashflows = cashflows;
    }

    public Double getTotalCashflowAmount() {
        return totalCashflowAmount;
    }

    public void setTotalCashflowAmount(Double totalCashflowAmount) {
        this.totalCashflowAmount = totalCashflowAmount;
    }
}
