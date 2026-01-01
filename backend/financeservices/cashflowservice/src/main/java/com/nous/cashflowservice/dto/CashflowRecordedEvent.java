package com.nous.cashflowservice.dto;

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
    private String transactionId; // Unique ID for this Saga instance
    private String contractId;
    private Double amount;
    private String assumptionType;
    private LocalDate cashflowDate;
    private String status;
}
