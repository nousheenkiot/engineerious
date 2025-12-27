package com.nous.processingservice.repository;

import com.nous.processingservice.model.ProcessingRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessingRunRepository extends JpaRepository<ProcessingRun, Long> {
}
