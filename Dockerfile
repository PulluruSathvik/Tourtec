# Multi-stage Docker build for TOURTEC Spring Boot Backend
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Java Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV PORT=5000
EXPOSE 5000

ENTRYPOINT ["java", "-jar", "app.jar"]
