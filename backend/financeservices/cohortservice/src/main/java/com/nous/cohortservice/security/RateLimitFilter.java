package com.nous.cohortservice.security;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimiterRegistry rateLimiterRegistry;

    public RateLimitFilter(RateLimiterRegistry rateLimiterRegistry) {
        this.rateLimiterRegistry = rateLimiterRegistry;
    }

    private RateLimiter getRateLimiter(String uri, String key) {
        if (uri.contains("/login") || uri.contains("/auth/")) {
            RateLimiterConfig authConfig = RateLimiterConfig.custom()
                    .limitRefreshPeriod(Duration.ofMinutes(1))
                    .limitForPeriod(5)
                    .timeoutDuration(Duration.ZERO)
                    .build();
            return rateLimiterRegistry.rateLimiter(key, authConfig);
        } else {
            return rateLimiterRegistry.rateLimiter(key);
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
            
        String ip = request.getRemoteAddr();
        if (ip == null) {
            ip = "unknown";
        }
        
        String uri = request.getRequestURI();
        String endpointGroup = (uri.contains("/login") || uri.contains("/auth/")) ? "auth" : "default";
        
        String key = "rate_limit:" + endpointGroup + ":" + ip;

        RateLimiter rateLimiter = getRateLimiter(uri, key);

        boolean permission = rateLimiter.acquirePermission(1);

        if (permission) {
            response.setHeader("X-Rate-Limit-Remaining", "Available");
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("X-Rate-Limit-Remaining", "0");
            response.setHeader("Retry-After", "60");
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too Many Requests\", \"message\": \"Rate limit exceeded. Try again later.\", \"retryAfterSeconds\": 60}");
        }
    }
}
