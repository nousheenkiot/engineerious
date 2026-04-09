# AWS Lambda API Gateway Authorizer

This project contains a Java AWS Lambda function designed to authenticate requests from API Gateway or compatible ingresses.

It validates JWT tokens from `Authorization: Bearer <token>` headers and conditionally outputs an IAM Policy granting access (`Allow`) to the requested API resource.

## Code Structure

- **com.engineerious.auth.ApiGatewayAuthorizer**: Implements `RequestHandler<APIGatewayCustomAuthorizerEvent, IamPolicyResponse>`.
- Token signature is verified using the HMAC256 algorithm with `java-jwt` library.

## Build the code

To create a deployable jar for AWS Lambda, run:
```shell
../financeservices/mvnw clean package
```

This will produce `target/api-gateway-authorizer-1.0.0.jar`, which contains all the required dependencies (fat-jar).

## Deployment

1. Create a new AWS Lambda Function in the AWS Console.
2. Setup the Runtime as `Java 17`.
3. Set the **Handler** to `com.engineerious.auth.ApiGatewayAuthorizer::handleRequest`.
4. Upload the generated JAR from `target/api-gateway-authorizer-1.0.0.jar`.
5. Set up required Environment Variables for the Lambda:
   - `JWT_SECRET`: The secret key used to verify the JWT tokens.
6. Configure API Gateway to use this function as a Custom Authorizer (Lambda Authorizer).

## Behavior
- Returns **Allow** policy if the token signature is perfectly matching.
- Returns **Deny** policy if there was a problem interpreting the policy structure.
- Throws an **Unauthorized Exception** if the token is invalid or missing, making API gateway return exactly an HTTP 401 Unauthorized status.
