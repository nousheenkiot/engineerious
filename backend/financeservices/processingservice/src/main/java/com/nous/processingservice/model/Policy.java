package com.nous.processingservice.model;

import java.io.Serializable;
import java.time.LocalDate;

public class Policy implements Serializable {
    private Long id;
    private String policyNumber;
    private String holderName;
    private Double premium;
    private LocalDate fyDate;
    private String assumption;

    public Policy() {
    }

    public Policy(Long id, String policyNumber, String holderName, Double premium, LocalDate fyDate,
            String assumption) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.holderName = holderName;
        this.premium = premium;
        this.fyDate = fyDate;
        this.assumption = assumption;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public Double getPremium() {
        return premium;
    }

    public void setPremium(Double premium) {
        this.premium = premium;
    }

    public LocalDate getFyDate() {
        return fyDate;
    }

    public void setFyDate(LocalDate fyDate) {
        this.fyDate = fyDate;
    }

    public String getAssumption() {
        return assumption;
    }

    public void setAssumption(String assumption) {
        this.assumption = assumption;
    }

    @Override
    public String toString() {
        return "Policy{" +
                "id=" + id +
                ", policyNumber='" + policyNumber + '\'' +
                ", holderName='" + holderName + '\'' +
                ", premium=" + premium +
                ", fyDate=" + fyDate +
                ", assumption='" + assumption + '\'' +
                '}';
    }
}
