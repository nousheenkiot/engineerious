package com.nous.processingservice.controller;

import com.nous.processingservice.service.ProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/processing")
public class ProcessingController {

    @Autowired
    private ProcessingService processingService;

    @PostMapping("/discounting")
    public String discountingByFyDate(
            @RequestParam("fyDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fyDate) {
        return processingService.discountingByFyDate(fyDate);
    }
}
