FROM openjdk:24-ea-slim
WORKDIR /app
COPY target/configserver-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-Dspring.profiles.active=native", "-jar", "app.jar"]
