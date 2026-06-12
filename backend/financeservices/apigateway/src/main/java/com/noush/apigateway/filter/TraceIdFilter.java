package com.noush.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class TraceIdFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(TraceIdFilter.class);
    public static final String TRACE_ID_HEADER_NAME = "X-Trace-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        HttpHeaders headers = exchange.getRequest().getHeaders();
        String traceId;
        
        if (headers.containsKey(TRACE_ID_HEADER_NAME)) {
            traceId = headers.getFirst(TRACE_ID_HEADER_NAME);
            logger.debug("Trace ID found in incoming request: {}", traceId);
        } else {
            traceId = UUID.randomUUID().toString();
            logger.debug("Generating new Trace ID: {}", traceId);
            
            // Mutate request to add the trace ID
            exchange = exchange.mutate()
                    .request(exchange.getRequest().mutate()
                            .header(TRACE_ID_HEADER_NAME, traceId)
                            .build())
                    .build();
        }

        // We also want to add it to the response headers
        final String finalTraceId = traceId;
        exchange.getResponse().getHeaders().add(TRACE_ID_HEADER_NAME, finalTraceId);

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
