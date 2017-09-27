pipeline {
    agent { 
            docker{
                image 'node:latest' 
                args  '-v npm_cache:/usr/local/lib/node_modules/ -u node' 
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