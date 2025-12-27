package com.nous.processingservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class ProcessingRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fyDate;
    private LocalDateTime runTimestamp;
    private String status;
    private String result;

    public ProcessingRun() {
    }

    public ProcessingRun(LocalDate fyDate, LocalDateTime runTimestamp, String status, String result) {
        this.fyDate = fyDate;
        this.runTimestamp = runTimestamp;
        this.status = status;
        this.result = result;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFyDate() {
        return fyDate;
    }

    public void setFyDate(LocalDate fyDate) {
        this.fyDate = fyDate;
    }

    public LocalDateTime getRunTimestamp() {
        return runTimestamp;
    }

    public void setRunTimestamp(LocalDateTime runTimestamp) {
        this.runTimestamp = runTimestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
