pipeline {
    agent {
        docker {
            // Use an official Java 25 image
            image 'eclipse-temurin:25-jdk'

            // Optional but recommended: Mount a volume to cache Gradle dependencies
            // between pipeline runs, significantly speeding up build times.
            args '-v gradle-cache:/root/.gradle'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                // Pulls code from your configured SCM (e.g., GitHub, GitLab)
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                // Ensure the Gradle wrapper has execution permissions
                sh 'chmod +x gradlew'

                // Execute the build using Java 25
                sh './gradlew clean build'
            }
        }
    }

    post {
        always {
            // Archive test results if your build produces them
            junit 'build/test-results/**/*.xml'
        }
    }
}