package com.nous.authservice.controller;

import com.nous.authservice.config.JwtProperties;
import com.nous.authservice.dto.LoginRequest;
import com.nous.authservice.dto.LoginResponse;
import com.nous.authservice.dto.UserInfoResponse;
import com.nous.authservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Claims;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String normalizedUsername = request.getUsername() != null ? request.getUsername().toLowerCase() : null;
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedUsername, request.getPassword())
            );

            org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

            Map<String, Object> claims = new HashMap<>();
            
            // Extract roles and activities from authorities
            List<String> authorities = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            
            List<String> roles = authorities.stream()
                    .filter(a -> a.startsWith("ROLE_"))
                    .collect(Collectors.toList());
            List<String> activities = authorities.stream()
                    .filter(a -> !a.startsWith("ROLE_"))
                    .collect(Collectors.toList());

            claims.put("roles", roles);
            claims.put("activities", activities);

            // Determine scopes
            Set<String> scopeSet = new HashSet<>();
            if (jwtProperties.getScope() != null && !jwtProperties.getScope().isEmpty()) {
                scopeSet.addAll(Arrays.asList(jwtProperties.getScope().split(" ")));
            }
            
            // Map roles to scopes: ROLE_ADMIN -> admin, read, write. ROLE_USER -> read.
            for (String role : roles) {
                String roleName = role.substring(5).toLowerCase(); // remove ROLE_
                if ("admin".equals(roleName)) {
                    scopeSet.add("read");
                    scopeSet.add("write");
                    scopeSet.add("admin");
                } else if ("user".equals(roleName)) {
                    scopeSet.add("read");
                }
            }
            String finalScope = String.join(" ", scopeSet);
            claims.put("scope", finalScope);

            String token = jwtUtil.generateToken(userDetails.getUsername(), claims);
            return ResponseEntity.ok(new LoginResponse(
                    token,
                    "Bearer",
                    jwtProperties.getExpiration() / 1000,
                    finalScope
            ));

        } catch (AuthenticationException e) {
             return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/userinfo")
    public ResponseEntity<UserInfoResponse> getUserInfo(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String username = jwtUtil.extractUsername(token);
            Claims claims = jwtUtil.extractAllClaims(token);
            String scope = jwtUtil.extractScope(token);
            
            return ResponseEntity.ok(new UserInfoResponse(
                    username,
                    (List<String>) claims.get("activities"),
                    (List<String>) claims.get("roles"),
                    scope
            ));
        }
        return ResponseEntity.status(401).build();
    }
}
