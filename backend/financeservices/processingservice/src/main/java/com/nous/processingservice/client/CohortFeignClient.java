package com.nous.processingservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;

@FeignClient(name = "cohortservice", path = "/api")
public interface CohortFeignClient {

    @PostMapping("/policies/load")
    String loadPolicies(@RequestParam("date") LocalDate date);

    @GetMapping("/policies/fic")
    List<Object> getPoliciesByFicDate(@RequestParam("date") LocalDate date);

    @PostMapping("/cashflows/load")
    String loadCashflows();
}
