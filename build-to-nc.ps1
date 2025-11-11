# ENSM 프로젝트 빌드 및 NC Data 폴더로 복사 스크립트 (PowerShell)
# 출력 경로: C:\Users\HM_LT\NC\Data

$OUTPUT_DIR = "C:\Users\HM_LT\NC\Data"
$JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:JAVA_HOME = $JAVA_HOME
$env:PATH = "$JAVA_HOME\bin;$env:PATH"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ENSM 프로젝트 빌드 및 복사" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 출력 디렉토리 생성
if (-not (Test-Path $OUTPUT_DIR)) {
    Write-Host "출력 디렉토리 생성: $OUTPUT_DIR" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $OUTPUT_DIR -Force | Out-Null
}

# 기존 파일 삭제
Write-Host "기존 파일 삭제 중..." -ForegroundColor Yellow
Get-ChildItem -Path $OUTPUT_DIR -Filter "ensm-*.jar" -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Host ""

# ========================================
# ensm-auth 빌드
# ========================================
Write-Host "[1/2] ensm-auth 빌드 중..." -ForegroundColor Green
Push-Location ensm-auth
try {
    & .\gradlew.bat clean build -x test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ensm-auth 빌드 실패" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    # ensm-auth JAR 파일 복사
    Write-Host "ensm-auth JAR 파일 복사 중..." -ForegroundColor Yellow
    $jarFile = "build\libs\ensm-auth-0.0.1-SNAPSHOT.jar"
    if (Test-Path $jarFile) {
        Copy-Item -Path $jarFile -Destination $OUTPUT_DIR -Force
        Write-Host "✅ ensm-auth 빌드 및 복사 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ ensm-auth JAR 파일을 찾을 수 없습니다" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} finally {
    Pop-Location
}
Write-Host ""

# ========================================
# ensm-main 빌드
# ========================================
Write-Host "[2/2] ensm-main 빌드 중..." -ForegroundColor Green
Push-Location ensm-main
try {
    & .\gradlew.bat clean build -x test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ensm-main 빌드 실패" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    # ensm-main JAR 파일 복사
    Write-Host "ensm-main JAR 파일 복사 중..." -ForegroundColor Yellow
    $jarFile = "build\libs\ensm-main-0.0.1-SNAPSHOT.jar"
    if (Test-Path $jarFile) {
        Copy-Item -Path $jarFile -Destination $OUTPUT_DIR -Force
        Write-Host "✅ ensm-main 빌드 및 복사 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ ensm-main JAR 파일을 찾을 수 없습니다" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} finally {
    Pop-Location
}
Write-Host ""

# ========================================
# 완료
# ========================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ 빌드 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "출력 위치: $OUTPUT_DIR" -ForegroundColor Yellow
Write-Host ""
Get-ChildItem -Path $OUTPUT_DIR -Filter "ensm-*.jar" | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}, LastWriteTime | Format-Table -AutoSize
Write-Host ""

