package com.nous.cohortservice.repository;

import com.nous.cohortservice.entity.FailedMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FailedMessageRepository extends JpaRepository<FailedMessage, Long> {
    List<FailedMessage> findByProcessedFalse();

    List<FailedMessage> findByProcessedFalseAndNextRetryTimeBefore(java.time.LocalDateTime dateTime);
}
