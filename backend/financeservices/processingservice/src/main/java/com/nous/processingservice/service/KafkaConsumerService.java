package com.nous.processingservice.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "cashflow-loaded", groupId = "processing-group")
    public void consume(String message) {
        System.out.println("Received Message: " + message);
        // Process the policies and fyDates here
    }
}
