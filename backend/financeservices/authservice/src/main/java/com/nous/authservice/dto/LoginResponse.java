package com.nous.authservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {
    
    @JsonProperty("access_token")
    private String token;

    @JsonProperty("token_type")
    private String tokenType = "Bearer";

    @JsonProperty("expires_in")
    private long expiresIn;

    private String scope;

    public LoginResponse() {}

    public LoginResponse(String token) {
        this.token = token;
    }

    public LoginResponse(String token, String tokenType, long expiresIn, String scope) {
        this.token = token;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.scope = scope;
    }

    public String getToken() { 
        return token; 
    }
    
    public void setToken(String token) { 
        this.token = token; 
    }

    public String getTokenType() { 
        return tokenType; 
    }
    
    public void setTokenType(String tokenType) { 
        this.tokenType = tokenType; 
    }

    public long getExpiresIn() { 
        return expiresIn; 
    }
    
    public void setExpiresIn(long expiresIn) { 
        this.expiresIn = expiresIn; 
    }

    public String getScope() { 
        return scope; 
    }
    
    public void setScope(String scope) { 
        this.scope = scope; 
    }
}
