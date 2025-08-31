pipeline {
  agent {
    docker {
      image 'cimg/node:20.16-browsers'
      args '-u root:root'
    }
  }

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    CHROME_BIN = '/usr/bin/google-chrome'
    CI = 'true'
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'node -v && npm -v'
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Start Server') {
      steps {
        sh '''
          # Serve production build on port 3000
          npx serve -s build -l 3000 > server.log 2>&1 &
          echo $! > .server.pid

          # Wait for server to be ready (up to ~60s)
          for i in $(seq 1 60); do
            if curl -fsS http://127.0.0.1:3000 > /dev/null; then
              echo "Server is up"
              break
            fi
            echo "Waiting for server... ($i)"
            sleep 1
          done
        '''
      }
    }

    stage('Test: Selenium') {
      steps {
        sh 'npx chromedriver --version'
        sh 'npm run test:selenium'
      }
      post {
        always {
          archiveArtifacts artifacts: 'server.log', allowEmptyArchive: true
        }
      }
    }
  }

  post {
    always {
      sh 'if [ -f .server.pid ]; then kill $(cat .server.pid) || true; fi'
    }
  }
}
