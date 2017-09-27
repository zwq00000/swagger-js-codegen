pipeline {
    agent { 
            docker{
                image 'node:latest' 
                args  '-v /tmp/.npm:/.npm' 
            }
    }
    stages {
        stage('build') {
            steps {
                sh 'npm install'
                sh 'npm run test'
            }
        }
    }
}