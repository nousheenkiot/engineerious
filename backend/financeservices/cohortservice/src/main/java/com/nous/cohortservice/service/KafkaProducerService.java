package com.nous.cohortservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class KafkaProducerService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(KafkaProducerService.class);

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private com.nous.cohortservice.repository.FailedMessageRepository failedMessageRepository;

    public void sendMessage(String topic, String message) {
        try {
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(topic, message);
            handleAcknowledgement(future, topic, null, message);
        } catch (Exception e) {
            log.error("Failed to initiate send to topic: {} with message: {}", topic, message, e);
            saveFailedMessage(topic, null, message, e.getMessage());
        }
    }

    public void sendMessage(String topic, String key, String message) {
        try {
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(topic, key, message);
            handleAcknowledgement(future, topic, key, message);
        } catch (Exception e) {
            log.error("Failed to initiate send to topic: {} with key: {}", topic, key, e);
            saveFailedMessage(topic, key, message, e.getMessage());
        }
    }

    public void sendMessageWithPartition(String topic, String key, String message) {
        try {
            int partition = Math.abs(key.hashCode()) % 3;
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(topic, partition, key, message);
            handleAcknowledgement(future, topic, key, message);
        } catch (Exception e) {
            log.error("Failed to initiate send with partition to topic: {} with key: {}", topic, key, e);
            saveFailedMessage(topic, key, message, e.getMessage());
        }
    }

    private void handleAcknowledgement(CompletableFuture<SendResult<String, String>> future, String topic, String key,
            String message) {
        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Sent message to topic: {} with offset: {} partition: {}",
                        topic, result.getRecordMetadata().offset(), result.getRecordMetadata().partition());
            } else {
                log.error("Async fail (acks=all): Unable to send message to topic: {} after all ISRs due to: {}", topic,
                        ex.getMessage(), ex);
                saveFailedMessage(topic, key, message, ex.getMessage());
            }
        });
    }

    private void saveFailedMessage(String topic, String key, String message, String error) {
        try {
            com.nous.cohortservice.entity.FailedMessage failedMessage = new com.nous.cohortservice.entity.FailedMessage();
            failedMessage.setTopic(topic);
            failedMessage.setMessageKey(key);
            failedMessage.setMessageContent(message);
            failedMessage.setExceptionMessage(error);
            failedMessageRepository.save(failedMessage);
            log.info("Saved failed message to DB for topic: {}", topic);
        } catch (Exception e) {
            log.error("CRITICAL: Failed to save failed message to DB!", e);
        }
    }
}
