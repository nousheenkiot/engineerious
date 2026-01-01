package com.nous.cashflowservice.controller;

import com.nous.cashflowservice.entity.Cashflow;
import com.nous.cashflowservice.service.CashflowSagaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cashflow")
public class CashflowController {

    @Autowired
    private CashflowSagaService cashflowSagaService;

    @PostMapping("/record")
    public ResponseEntity<Cashflow> recordCashflow(@RequestBody Cashflow cashflow) {
        return ResponseEntity.ok(cashflowSagaService.recordCashflow(cashflow));
    }
}
