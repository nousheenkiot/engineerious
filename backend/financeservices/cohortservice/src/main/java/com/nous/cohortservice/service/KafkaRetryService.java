package com.nous.cohortservice.service;

import com.nous.cohortservice.entity.FailedMessage;
import com.nous.cohortservice.repository.FailedMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class KafkaRetryService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(KafkaRetryService.class);

    @Autowired
    private FailedMessageRepository failedMessageRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Scheduled(fixedDelay = 60000) // Retry every minute
    public void retryFailedMessages() {
        // Fetch valid retry candidates
        List<FailedMessage> failedMessages = failedMessageRepository
                .findByProcessedFalseAndNextRetryTimeBefore(java.time.LocalDateTime.now());

        if (!failedMessages.isEmpty()) {
            log.info("Found {} failed messages ready to retry", failedMessages.size());
        }

        for (FailedMessage failedMessage : failedMessages) {
            // Check max retries
            if (failedMessage.getRetryCount() >= 5) {
                log.warn("Message id: {} reached max retry limit (5). Skipping.", failedMessage.getId());
                continue;
            }

            try {
                String topic = failedMessage.getTopic();
                String key = failedMessage.getMessageKey();
                String message = failedMessage.getMessageContent();

                // Idempotency Note:
                // 1. Kafka Producer Idempotence (enable.idempotence=true) handles duplication
                // at protocol level.
                // 2. Application Idempotence: Using the same key ensures the message goes to
                // the same partition.
                // 3. 'processed' flag in DB ensures we don't retry successfully sent messages.

                CompletableFuture<SendResult<String, String>> future;
                if (key != null) {
                    future = kafkaTemplate.send(topic, key, message);
                } else {
                    future = kafkaTemplate.send(topic, message);
                }

                future.whenComplete((result, ex) -> {
                    if (ex == null) {
                        failedMessage.setProcessed(true);
                        failedMessage.setExceptionMessage(null); // Clear previous error
                        failedMessageRepository.save(failedMessage);
                        log.info("Successfully retried message id: {}", failedMessage.getId());
                    } else {
                        handleRetryFailure(failedMessage, ex.getMessage());
                    }
                });

            } catch (Exception e) {
                handleRetryFailure(failedMessage, e.getMessage());
            }
        }
    }

    private void handleRetryFailure(FailedMessage failedMessage, String error) {
        int retryCount = failedMessage.getRetryCount() + 1;
        failedMessage.setRetryCount(retryCount);
        failedMessage.setExceptionMessage(error);

        // Exponential backoff: 2^retryCount * 1 minute (or base duration)
        // Attempt 1: 2 min
        // Attempt 2: 4 min
        // Attempt 3: 8 min
        long backoffMinutes = (long) Math.pow(2, retryCount);
        failedMessage.setNextRetryTime(java.time.LocalDateTime.now().plusMinutes(backoffMinutes));

        failedMessageRepository.save(failedMessage);
        log.error("Retry failed for message id: {}. Next retry in {} minutes. Attempt: {}",
                failedMessage.getId(), backoffMinutes, retryCount);
    }
}
