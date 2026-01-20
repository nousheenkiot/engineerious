package com.nous.processingservice.controller;

import com.nous.processingservice.config.ProcessingTopologyConfig;
import com.nous.processingservice.dto.PolicyCashflowAggregation;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StoreQueryParameters;
import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.config.StreamsBuilderFactoryBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/aggregation")
public class AggregationController {

    @Autowired
    private StreamsBuilderFactoryBean factoryBean;

    @GetMapping("/{policyNumber}")
    public ResponseEntity<PolicyCashflowAggregation> getAggregation(@PathVariable String policyNumber) {
        KafkaStreams kafkaStreams = factoryBean.getKafkaStreams();
        if (kafkaStreams == null) {
            return ResponseEntity.status(503).build(); // Service Unavailable
        }

        try {
            ReadOnlyKeyValueStore<String, PolicyCashflowAggregation> store = kafkaStreams
                    .store(StoreQueryParameters.fromNameAndType(
                            ProcessingTopologyConfig.AGGREGATION_STORE,
                            QueryableStoreTypes.keyValueStore()));

            PolicyCashflowAggregation result = store.get(policyNumber);

            if (result == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(result);
        } catch (org.apache.kafka.streams.errors.InvalidStateStoreException e) {
            return ResponseEntity.status(503).body(null); // Store not ready
        }
    }
}
