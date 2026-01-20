package com.nous.processingservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.nous.processingservice.dto.CashflowRecordedEvent;
import com.nous.processingservice.dto.PolicyCashflowAggregation;
import com.nous.processingservice.model.Policy;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.*;
import org.apache.kafka.streams.state.KeyValueBytesStoreSupplier;
import org.apache.kafka.streams.state.Stores;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafkaStreams;
import org.springframework.kafka.annotation.KafkaStreamsDefaultConfiguration;
import org.springframework.kafka.config.KafkaStreamsConfiguration;
import org.springframework.kafka.support.serializer.JsonSerde;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafkaStreams
public class ProcessingTopologyConfig {

        private static final Logger log = LoggerFactory.getLogger(ProcessingTopologyConfig.class);

        public static final String POLICY_STORE = "policy-store";
        public static final String AGGREGATION_STORE = "policy-cashflow-aggregation-store";

        @Bean(name = KafkaStreamsDefaultConfiguration.DEFAULT_STREAMS_CONFIG_BEAN_NAME)
        public KafkaStreamsConfiguration kStreamsConfigs() {
                Map<String, Object> props = new HashMap<>();
                props.put(StreamsConfig.APPLICATION_ID_CONFIG, "finance-processing-aggregator");
                props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:29092"); // Should use env var but for now
                                                                                      // hardcoded fallback
                props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
                props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName()); // Default
                                                                                                                 // string,
                                                                                                                 // usage
                                                                                                                 // handles
                                                                                                                 // others
                // Improve processing guarantee if needed, e.g. EXACTLY_ONCE_V2
                props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.AT_LEAST_ONCE);

                // This is important for KTable state dir
                props.put(StreamsConfig.STATE_DIR_CONFIG, System.getProperty("java.io.tmpdir") + "/kafka-streams");

                return new KafkaStreamsConfiguration(props);
        }

        @Bean
        public KStream<String, PolicyCashflowAggregation> kStream(StreamsBuilder streamsBuilder) {
                ObjectMapper mapper = new ObjectMapper();
                mapper.registerModule(new JavaTimeModule());

                JsonSerde<Policy> policySerde = SerdeFactory.createJsonSerde(Policy.class, mapper);
                JsonSerde<CashflowRecordedEvent> cashflowSerde = SerdeFactory.createJsonSerde(
                                CashflowRecordedEvent.class,
                                mapper);
                JsonSerde<PolicyCashflowAggregation> aggregationSerde = SerdeFactory
                                .createJsonSerde(PolicyCashflowAggregation.class, mapper);

                // 1. Table of Policies
                // Input topic: policy-events
                // Key: policyNumber, Value: Policy JSON
                KTable<String, Policy> policyTable = streamsBuilder.table(
                                "policy-events",
                                Materialized.<String, Policy>as(Stores.persistentKeyValueStore(POLICY_STORE))
                                                .withKeySerde(Serdes.String())
                                                .withValueSerde(policySerde));

                // 2. Stream of Cashflows
                // Input topic: cashflow-recorded
                // Key: contractId (policyNumber), Value: CashflowRecordedEvent JSON
                KStream<String, CashflowRecordedEvent> cashflowStream = streamsBuilder.stream(
                                "cashflow-recorded",
                                Consumed.with(Serdes.String(), cashflowSerde));

                // 3. Aggregate Cashflows per Policy
                // Since we want to join with Policy to have policy details, we can first
                // aggregate the cashflows,
                // then join with Policy KTable. OR join each cashflow with policy then
                // aggregate.
                // The user request "put policy under cahflowlist" suggests the result should
                // have (Policy + List<Cashflow>).

                // Strategy:
                // Group Cashflows by Key -> KGroupedStream
                // Aggregate into a list -> KTable<String, List<CashflowRecordedEvent>>
                // Join with Policy KTable -> KTable<String, PolicyCashflowAggregation>

                KTable<String, PolicyCashflowAggregation> aggregatedCashflows = cashflowStream
                                .groupByKey(Grouped.with(Serdes.String(), cashflowSerde))
                                .aggregate(
                                                PolicyCashflowAggregation::new, // Initializer
                                                (key, value, aggregate) -> {
                                                        aggregate.addCashflow(value);
                                                        return aggregate;
                                                },
                                                Materialized
                                                                .<String, PolicyCashflowAggregation>as(
                                                                                Stores.persistentKeyValueStore(
                                                                                                "temp-cashflow-agg"))
                                                                .withKeySerde(Serdes.String())
                                                                .withValueSerde(aggregationSerde));

                // 4. Join with Policy Table
                // result: KTable
                KTable<String, PolicyCashflowAggregation> resultTable = aggregatedCashflows.join(
                                policyTable,
                                (aggregation, policy) -> {
                                        aggregation.setPolicy(policy);
                                        return aggregation;
                                },
                                Materialized.<String, PolicyCashflowAggregation>as(
                                                Stores.persistentKeyValueStore(AGGREGATION_STORE))
                                                .withKeySerde(Serdes.String())
                                                .withValueSerde(aggregationSerde));

                // Optional: Send to output topic if needed, but we wanted an endpoint so the
                // Store is more important.
                resultTable.toStream().to("policy-cashflow-aggregated",
                                Produced.with(Serdes.String(), aggregationSerde));

                return resultTable.toStream();
        }
}
