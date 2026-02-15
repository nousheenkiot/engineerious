package com.nous.cohortservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "failed_messages")
public class FailedMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;
    private String messageKey;

    @Column(columnDefinition = "TEXT")
    private String messageContent;

    private String exceptionMessage;

    private LocalDateTime createdAt = LocalDateTime.now();

    private int retryCount = 0;

    private LocalDateTime nextRetryTime = LocalDateTime.now();

    private boolean processed = false;
}
