pipeline {
    agent any

    tools {
        jdk 'JDK25'
    }

    environment {
        GRADLE_OPTS = '-Dorg.gradle.daemon=false'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Java') {
            steps {
                sh '''
                    java -version
                    chmod +x gradlew
                    ./gradlew --version
                '''
            }
        }

        stage('Build') {
            steps {
                sh './gradlew clean build'
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: '**/build/libs/*.jar', fingerprint: true
            }
        }
    }

    post {
        always {
            junit '**/build/test-results/test/*.xml'
        }

        success {
            echo 'Build succeeded.'
        }

        failure {
            echo 'Build failed.'
        }
    }
}