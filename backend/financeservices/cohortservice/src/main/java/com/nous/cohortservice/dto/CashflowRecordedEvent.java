package com.nous.cohortservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashflowRecordedEvent {
    private String transactionId;
    private String contractId; // In cohort service, this maps to policyNumber
    private Double amount;
    private String assumptionType;
    private LocalDate cashflowDate;
    private String status;
}
