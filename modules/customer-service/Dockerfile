
# Use the official OpenJDK 17 image as the base image
FROM eclipse-temurin:21-jdk
# Set the working directory inside the container
WORKDIR /app

# Copy the built jar file from the host to the container
COPY build/libs/customer-service-0.1.0-SNAPSHOT.jar app.jar

# Expose the port the application will run on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]