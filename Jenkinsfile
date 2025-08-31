pipeline {
  agent any // Run on your local Jenkins agent/PC (no Docker)

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    // Typical Windows Chrome path; adjust if needed on your PC
    CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
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
        bat 'node -v'
        bat 'npm -v'
        // Prefer clean, fall back to install if lock mismatch
        bat 'npm ci || npm install'
      }
    }

    stage('Build') {
      steps {
        bat 'npm run build'
      }
    }

    stage('Start Server') {
      steps {
        // Start CRA dev server (npm start) on port 3000 in the background
        powershell '''
          $log = 'server.log'
          if (Test-Path $log) { Remove-Item $log -Force }
          $env:PORT = '3000'
          $env:BROWSER = 'none'
          $proc = Start-Process -FilePath 'npm.cmd' -ArgumentList 'start' -NoNewWindow -PassThru \
            -RedirectStandardOutput $log -RedirectStandardError $log
          $proc.Id | Out-File -FilePath .server.pid -Encoding ascii

          # Wait for server to be ready (up to ~90s to allow initial compile)
          $ready = $false
          for ($i = 1; $i -le 90; $i++) {
            try {
              $resp = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:3000' -TimeoutSec 2
              if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) { $ready = $true; break }
            } catch {}
            Start-Sleep -Seconds 1
          }
          if (-not $ready) {
            Write-Host '--- server.log tail ---'
            if (Test-Path $log) { Get-Content $log -Tail 100 | Write-Host }
            Write-Error 'Dev server did not start in time'
            exit 1
          }
        '''
      }
    }

    stage('Test: Selenium') {
      steps {
        bat 'npx chromedriver --version'
        bat 'npm run test:selenium'
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
      // Stop the static server if it was started
      powershell '''
        if (Test-Path .server.pid) {
          $pid = Get-Content .server.pid | Select-Object -First 1
          try { Stop-Process -Id $pid -Force } catch {}
        }
      '''
    }
  }
}
