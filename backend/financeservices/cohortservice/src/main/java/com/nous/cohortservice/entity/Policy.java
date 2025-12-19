package com.nous.cohortservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import java.time.LocalDate;
import com.nous.cohortservice.enums.PolicyAssumption;

@Entity
@Table(name = "policies")

public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String policyNumber;
    private String holderName;
    private Double premium;

    private LocalDate fyDate;

    @Enumerated(EnumType.STRING)
    private PolicyAssumption assumption;

    @jakarta.persistence.Version
    private Long version;

    public Policy() {
    }

    public Policy(Long id, String policyNumber, String holderName, Double premium, Long version, LocalDate fyDate,
            PolicyAssumption assumption) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.holderName = holderName;
        this.premium = premium;
        this.version = version;
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

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public LocalDate getFyDate() {
        return fyDate;
    }

    public void setFyDate(LocalDate fyDate) {
        this.fyDate = fyDate;
    }

    public PolicyAssumption getAssumption() {
        return assumption;
    }

    public void setAssumption(PolicyAssumption assumption) {
        this.assumption = assumption;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Policy policy = (Policy) o;
        return java.util.Objects.equals(id, policy.id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Policy{" +
                "id=" + id +
                ", policyNumber='" + policyNumber + '\'' +
                ", holderName='" + holderName + '\'' +
                ", premium=" + premium +
                ", fyDate=" + fyDate +
                ", assumption=" + assumption +
                ", version=" + version +
                '}';
    }
}
