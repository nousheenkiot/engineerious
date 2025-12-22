FROM openjdk:24-ea-slim
WORKDIR /app
COPY target/processingservice-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
