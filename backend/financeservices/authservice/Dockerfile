FROM openjdk:24-ea-slim
WORKDIR /app
COPY target/authservice-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
