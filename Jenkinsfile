pipeline {
    agent any

    environment {
        GITHUB_USER = credentials('github-packages')
    }

    stages {
        stage('Build') {
            steps {
                sh '''
                export GITHUB_USERNAME=$GITHUB_USER_USR
                export GITHUB_TOKEN=$GITHUB_USER_PSW

                ./gradlew build
                '''
            }
        }
    }
}