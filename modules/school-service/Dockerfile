# Use OpenJDK 25 JRE Alpine
FROM eclipse-temurin:25-jre-alpine

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 app && adduser -u 1001 -G app -D app

# Download OpenTelemetry Java agent
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar /app/opentelemetry-javaagent.jar

# Copy application jar
COPY build/libs/school-service-0.1.6-SNAPSHOT.jar app.jar

# Set ownership
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Expose app port
EXPOSE 8080

# Run app with OpenTelemetry agent
ENTRYPOINT ["java", \
"-javaagent:/app/opentelemetry-javaagent.jar", \
"-jar", \
"/app/app.jar"]