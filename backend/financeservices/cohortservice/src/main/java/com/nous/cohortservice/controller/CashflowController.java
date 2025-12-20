package com.nous.cohortservice.controller;

import com.nous.cohortservice.entity.Cashflow;
import com.nous.cohortservice.service.CashflowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cashflows")
@Tag(name = "Cashflow Management", description = "APIs for managing cashflows")
public class CashflowController {

    @Autowired
    private CashflowService cashflowService;

    @Operation(summary = "Get all cashflows", description = "Retrieve all cashflow records")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all cashflows")
    })
    @GetMapping
    public List<Cashflow> getAllCashflows() {
        return cashflowService.getAllCashflows();
    }

    @Operation(summary = "Create or Update cashflow", description = "Create a new cashflow or update an existing one")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cashflow saved successfully"),
    })
    @PutMapping
    public Cashflow saveCashflow(@RequestBody Cashflow cashflow) {
        return cashflowService.saveCashflow(cashflow);
    }

    @Operation(summary = "Delete cashflow", description = "Delete a cashflow by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cashflow deleted successfully")
    })
    @DeleteMapping("/{id}")
    public void deleteCashflow(@PathVariable Long id) {
        cashflowService.deleteCashflow(id);
    }

    @Operation(summary = "Delete cashflows by Financial Year Date", description = "Delete all cashflows matching a specific Financial Year Date")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cashflows deleted successfully")
    })
    @DeleteMapping("/fydate")
    public void deleteCashflowsByFyDate(
            @Parameter(description = "Financial Year Date (yyyy-MM-dd)", required = true) @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fyDate) {
        cashflowService.deleteCashflowsByFyDate(fyDate);
    }

    @Operation(summary = "Delete all cashflows", description = "Delete all cashflow records from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All cashflows deleted successfully")
    })
    @DeleteMapping("/all")
    public String deleteAllCashflows() {
        cashflowService.deleteAllCashflows();
        return "All cashflows have been deleted successfully.";
    }

    @Operation(summary = "Load random cashflows", description = "Load 100 random cashflows for existing policies")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cashflows loaded successfully")
    })
    @PostMapping("/load")
    public String loadCashflows() {
        cashflowService.loadCashflows();
        return "100 Cashflows loaded successfully";
    }
}
