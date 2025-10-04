pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
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
        bat 'npm install'
      }
    }

    stage('Start Server') {
      steps {
        powershell '''
          $log = 'server.log'
          if (Test-Path $log) { Remove-Item $log -Force }

          # Set env variables for CRA dev server
          $env:PORT = '3000'
          $env:BROWSER = 'none'

          # Start npm in background WITHOUT -RedirectStandardOutput/-RedirectStandardError
          $proc = Start-Process -FilePath 'npm.cmd' -ArgumentList 'start' -NoNewWindow -PassThru

          # Save PID to file
          $proc.Id | Out-File -FilePath .server.pid -Encoding ascii

          # Wait for server to be ready (up to 90s)
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
    }
  }
}
