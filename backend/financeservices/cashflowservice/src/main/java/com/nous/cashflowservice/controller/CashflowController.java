package com.nous.cashflowservice.controller;

import com.nous.cashflowservice.entity.Cashflow;
import com.nous.cashflowservice.service.CashflowSagaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cashflow")
public class CashflowController {

    @Autowired
    private CashflowSagaService cashflowSagaService;

    @Autowired
    private com.nous.cashflowservice.repository.CashflowRepository cashflowRepository;

    @PostMapping("/record")
    public ResponseEntity<Cashflow> recordCashflow(@RequestBody Cashflow cashflow) {
        return ResponseEntity.ok(cashflowSagaService.recordCashflow(cashflow));
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<Cashflow>> getCashflowsByContract(@PathVariable String contractId) {
        return ResponseEntity.ok(cashflowRepository.findAllByContractId(contractId));
    }
}
