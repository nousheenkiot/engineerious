package com.noush.apigateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Value("${jwt.secret:very-secret-key-that-should-be-at-least-thirty-two-characters-long}")
    private String jwtSecret;

    // Public endpoints that do not require JWT validation
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/actuator",
            "/swagger-ui",
            "/v3/api-docs",
            "/api-docs"
    );

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().toString();

        // Check if the path is a public endpoint
        boolean isPublic = PUBLIC_ENDPOINTS.stream().anyMatch(path::startsWith);
        if (isPublic) {
            logger.debug("Public endpoint accessed: {}", path);
            ServerHttpRequest mutatedRequest = request.mutate()
                    .headers(httpHeaders -> {
                        httpHeaders.remove("X-User-Name");
                        httpHeaders.remove("X-User-Roles");
                    })
                    .build();
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        }

        // Get Authorization header
        HttpHeaders headers = request.getHeaders();
        if (!headers.containsKey(HttpHeaders.AUTHORIZATION)) {
            logger.warn("Missing Authorization header for secure endpoint: {}", path);
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Authorization header is missing");
        }

        String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Invalid Authorization header format for secure endpoint: {}", path);
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Invalid Authorization header format");
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String username = claims.getSubject();
            List<String> activities = (List<String>) claims.get("activities");

            logger.debug("Successfully validated token for user: {} on path: {}", username, path);

            // Mutate request headers to pass username and activities downstream
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Name", username != null ? username : "")
                    .header("X-User-Roles", activities != null ? String.join(",", activities) : "")
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (Exception e) {
            logger.error("JWT validation failed for path: {}, error: {}", path, e.getMessage());
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Invalid or expired JWT token");
        }
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add("Warning", message);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        // Run after TraceIdFilter (highest precedence)
        return -1;
    }
}
