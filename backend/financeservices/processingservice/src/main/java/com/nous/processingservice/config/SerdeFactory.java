package com.nous.processingservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.support.serializer.JsonSerde;

public class SerdeFactory {
    public static <T> JsonSerde<T> createJsonSerde(Class<T> targetType, ObjectMapper objectMapper) {
        JsonSerde<T> serde = new JsonSerde<>(targetType, objectMapper);
        serde.configure(java.util.Collections.emptyMap(), false);
        return serde;
    }
}
