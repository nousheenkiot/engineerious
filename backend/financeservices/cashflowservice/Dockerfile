FROM openjdk:24-ea-slim
WORKDIR /app
COPY target/cashflowservice-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
