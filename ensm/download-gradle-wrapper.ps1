# Gradle Wrapper JAR 다운로드 스크립트
$wrapperPath = "gradle\wrapper\gradle-wrapper.jar"
$wrapperUrl = "https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar"

if (-not (Test-Path $wrapperPath)) {
    Write-Host "Gradle wrapper JAR 파일이 없습니다. 다운로드 중..." -ForegroundColor Yellow
    
    # 디렉토리 생성
    $dir = Split-Path -Parent $wrapperPath
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    try {
        Invoke-WebRequest -Uri $wrapperUrl -OutFile $wrapperPath -UseBasicParsing
        $fileSize = (Get-Item $wrapperPath).Length
        if ($fileSize -lt 50000) {
            Write-Host "경고: 다운로드된 파일 크기가 너무 작습니다 ($fileSize bytes)" -ForegroundColor Yellow
            Write-Host "다시 다운로드를 시도합니다..." -ForegroundColor Yellow
            Remove-Item $wrapperPath -Force
            Start-Sleep -Seconds 2
            Invoke-WebRequest -Uri $wrapperUrl -OutFile $wrapperPath -UseBasicParsing
        }
        Write-Host "Gradle wrapper JAR 다운로드 완료! (크기: $((Get-Item $wrapperPath).Length) bytes)" -ForegroundColor Green
    } catch {
        Write-Host "오류: Gradle wrapper JAR 다운로드 실패" -ForegroundColor Red
        Write-Host "에러 메시지: $_" -ForegroundColor Red
        Write-Host "수동으로 다운로드하세요: $wrapperUrl" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Gradle wrapper JAR 이미 존재합니다." -ForegroundColor Green
}

