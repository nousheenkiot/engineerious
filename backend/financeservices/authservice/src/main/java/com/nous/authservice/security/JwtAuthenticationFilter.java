package com.nous.authservice.security;

import com.nous.authservice.service.CustomUserDetailsService;
import com.nous.authservice.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String contextPath = request.getContextPath();
        String pathWithoutContext = contextPath != null && !contextPath.isEmpty() && path.startsWith(contextPath)
                ? path.substring(contextPath.length())
                : path;
        
        return "/api/auth/login".equals(pathWithoutContext) 
                || "/api/auth/register".equals(pathWithoutContext)
                || pathWithoutContext.startsWith("/actuator");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                log.warn("JWT token is expired: {}", e.getMessage());
                response.addHeader("WWW-Authenticate", "Bearer error=\"invalid_token\", error_description=\"The access token expired\"");
            } catch (io.jsonwebtoken.security.SignatureException e) {
                log.warn("JWT signature validation failed: {}", e.getMessage());
                response.addHeader("WWW-Authenticate", "Bearer error=\"invalid_token\", error_description=\"The signature is invalid\"");
            } catch (io.jsonwebtoken.MalformedJwtException e) {
                log.warn("JWT token is malformed: {}", e.getMessage());
                response.addHeader("WWW-Authenticate", "Bearer error=\"invalid_token\", error_description=\"The token is malformed\"");
            } catch (Exception e) {
                log.error("Unexpected error parsing JWT: {}", e.getMessage());
                response.addHeader("WWW-Authenticate", "Bearer error=\"invalid_token\", error_description=\"Token processing failed\"");
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken
                            .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                } else {
                    log.warn("JWT validation failed for user: {}", username);
                }
            } catch (Exception e) {
                log.error("Could not set user authentication in security context: {}", e.getMessage());
            }
        }
        chain.doFilter(request, response);
    }
}
