package com.nous.authservice.controller;

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
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

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
            
            // Separate roles (start with ROLE_) and activities
            claims.put("roles", authorities.stream().filter(a -> a.startsWith("ROLE_")).collect(Collectors.toList()));
            claims.put("activities", authorities.stream().filter(a -> !a.startsWith("ROLE_")).collect(Collectors.toList()));

            String token = jwtUtil.generateToken(userDetails.getUsername(), claims);
            return ResponseEntity.ok(new LoginResponse(token));

        } catch (AuthenticationException e) {
             return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/userinfo")
    public ResponseEntity<UserInfoResponse> getUserInfo(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String username = jwtUtil.extractUsername(token);
            
            // Explicitly specify the return type for the lambda to avoid ambiguity
            Claims claims = jwtUtil.extractAllClaims(token);
            
            return ResponseEntity.ok(new UserInfoResponse(
                    username,
                    (List<String>) claims.get("activities"),
                    (List<String>) claims.get("roles")
            ));
        }
        return ResponseEntity.status(401).build();
    }
}
