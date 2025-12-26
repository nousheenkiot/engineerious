package com.nous.cohortservice.controller;

import com.nous.cohortservice.entity.Policy;
import com.nous.cohortservice.service.PolicyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@Tag(name = "Policy Management", description = "APIs for managing insurance policies")
public class PolicyController {

        @Autowired
        private PolicyService policyService;

        @Autowired
        private com.nous.cohortservice.service.PolicyLoaderService policyLoaderService;

        @Operation(summary = "Get all policies", description = "Retrieve all insurance policies")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved all policies")
        })
        @GetMapping
        public List<Policy> getAllPolicies() {
                return policyService.getAllPolicies();
        }

        @Operation(summary = "Get policy by ID", description = "Retrieve a specific policy by its ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved policy"),
                        @ApiResponse(responseCode = "404", description = "Policy not found")
        })
        @GetMapping("/{id}")
        public Policy getPolicyById(
                        @Parameter(description = "ID of the policy to retrieve", required = true) @PathVariable Long id) {
                return policyService.getPolicyById(id);
        }

        @Operation(summary = "Create a new policy", description = "Create a new insurance policy")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Policy created successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input")
        })
        @PostMapping
        public Policy createPolicy(
                        @Parameter(description = "Policy object to create", required = true) @RequestBody Policy policy) {
                return policyService.createPolicy(policy);
        }

        @Operation(summary = "Delete policy", description = "Delete a policy by its ID")
        @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Policy deleted successfully"),
                        @ApiResponse(responseCode = "404", description = "Policy not found") })
        @DeleteMapping("/{id}")
        public String deletePolicy(
                        @Parameter(description = "ID of the policy to delete", required = true) @PathVariable Long id) {
                policyService.deletePolicy(id);
                return "Policy with ID " + id + " deleted successfully.";
        }

        @Operation(summary = "Delete all policies", description = "Delete all insurance policies")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "All policies deleted successfully")
        })
        @DeleteMapping("/all")
        public String deleteAllPolicies() {
                policyService.deleteAllPolicies();
                return "All policies have been deleted successfully.";
        }

        @Operation(summary = "Update policy", description = "Update an existing policy by its ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Policy updated successfully"),
                        @ApiResponse(responseCode = "404", description = "Policy not found")
        })
        @PutMapping("/{id}")
        public Policy updatePolicy(
                        @Parameter(description = "ID of the policy to update", required = true) @PathVariable Long id,
                        @Parameter(description = "Updated policy object", required = true) @RequestBody Policy policy) {
                return policyService.updatePolicy(id, policy);
        }

        @Operation(summary = "Load random policies", description = "Load 20 random policies for a specific financial year")
        @ApiResponse(responseCode = "200", description = "Policies loaded successfully")
        @PostMapping("/load")
        public String loadPolicies(
                        @Parameter(description = "Financial Year Date (yyyy-MM-dd)", required = true) @RequestParam("date") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
                policyLoaderService.loadPolicies(date);
                return "20 Policies loaded successfully for date: " + date;
        }

        @Operation(summary = "Get policies by FIC date", description = "Retrieve a list of policies for a specific FIC date")
        @ApiResponse(responseCode = "200", description = "Policies retrieved successfully")
        @GetMapping("/fic")
        public List<Policy> getPoliciesByFicDate(
                        @Parameter(description = "FIC Date (yyyy-MM-dd)", required = true) @RequestParam("date") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
                return policyService.getPoliciesByFicDate(date);
        }
}