package com.nous.cashflowservice.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import io.github.bucket4j.distributed.ProxyManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final ProxyManager<String> proxyManager;

    public RateLimitFilter(ProxyManager<String> proxyManager) {
        this.proxyManager = proxyManager;
    }

    private BucketConfiguration getConfiguration(String uri) {
        // Endpoint-based limits
        if (uri.contains("/login") || uri.contains("/auth/")) {
            // Stricter limit for login: 5 requests per minute
            Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1)));
            return BucketConfiguration.builder().addLimit(limit).build();
        } else {
            // Default limit: 50 requests per minute
            Bandwidth limit = Bandwidth.classic(50, Refill.greedy(50, Duration.ofMinutes(1)));
            return BucketConfiguration.builder().addLimit(limit).build();
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
        
        // Use Redis for shared buckets. Keys are scoped by endpoint group and IP.
        String key = "rate_limit:" + endpointGroup + ":" + ip;

        BucketConfiguration configuration = getConfiguration(uri);
        Bucket bucket = proxyManager.builder().build(key, configuration);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            response.setHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            long waitForRefill = TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill());
            
            // Adding requested headers
            response.setHeader("X-Rate-Limit-Remaining", "0");
            response.setHeader("Retry-After", String.valueOf(waitForRefill));
            response.setContentType("application/json");
            response.getWriter().write(String.format("{\"error\": \"Too Many Requests\", \"message\": \"Rate limit exceeded. Try again later.\", \"retryAfterSeconds\": %d}", waitForRefill));
        }
    }
}
