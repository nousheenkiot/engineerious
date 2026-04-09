package com.engineerious.auth;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayCustomAuthorizerEvent;
import com.amazonaws.services.lambda.runtime.events.IamPolicyResponse;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class ApiGatewayAuthorizer implements RequestHandler<APIGatewayCustomAuthorizerEvent, IamPolicyResponse> {

    // Ideally, this should be fetched from environment variables or AWS Secrets Manager
    private static final String JWT_SECRET = System.getenv().getOrDefault("JWT_SECRET", "default-engineerious-super-secret-key");
    
    @Override
    public IamPolicyResponse handleRequest(APIGatewayCustomAuthorizerEvent event, Context context) {
        String token = event.getAuthorizationToken();
        String methodArn = event.getMethodArn();

        context.getLogger().log("Authorizer triggered. Method ARN: " + methodArn);

        if (token == null || token.isEmpty()) {
            context.getLogger().log("No authorization token provided.");
            throw new RuntimeException("Unauthorized");
        }

        // Typically tokens come as 'Bearer <token>'
        if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
            token = token.substring(7);
        }

        try {
            // Validate the token
            Algorithm algorithm = Algorithm.HMAC256(JWT_SECRET);
            
            // You can enhance security by requiring specific issuer or audience here
            JWTVerifier verifier = JWT.require(algorithm)
                    .build(); 
            
            DecodedJWT jwt = verifier.verify(token);
            String principalId = jwt.getSubject();
            if (principalId == null || principalId.isEmpty()) {
                principalId = "user"; // Fallback principal ID
            }

            context.getLogger().log("Token valid. Principal ID: " + principalId);

            Map<String, Object> authContext = new HashMap<>();
            // Map Claims to Context to pass to backend API
            jwt.getClaims().forEach((key, claim) -> {
                if (!claim.isNull() && !claim.isMissing() && claim.asString() != null) {
                    authContext.put(key, claim.asString());
                }
            });

            // Return an Allow policy
            return generatePolicy(principalId, "Allow", methodArn, authContext);

        } catch (JWTVerificationException exception) {
            context.getLogger().log("Token validation failed: " + exception.getMessage());
            // Throwing "Unauthorized" signals a 401 response from API Gateway
            throw new RuntimeException("Unauthorized");
        } catch (Exception e) {
            context.getLogger().log("Error in authorizer: " + e.getMessage());
            // Return Deny policy
            return generatePolicy("anonymous", "Deny", methodArn, Collections.emptyMap());
        }
    }

    private IamPolicyResponse generatePolicy(String principalId, String effect, String resource, Map<String, Object> context) {
        IamPolicyResponse.PolicyDocument policyDocument = IamPolicyResponse.PolicyDocument.builder()
                .withVersion("2012-10-17")
                .withStatement(Collections.singletonList(
                        IamPolicyResponse.Statement.builder()
                                .withAction("execute-api:Invoke")
                                .withEffect(effect)
                                .withResource(Collections.singletonList(resource))
                                .build()
                ))
                .build();

        IamPolicyResponse response = IamPolicyResponse.builder()
                .withPrincipalId(principalId)
                .withPolicyDocument(policyDocument)
                .withContext(context)
                .build();

        return response;
    }
}
