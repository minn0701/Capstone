@echo off
REM ENSM 프로젝트 빌드 및 NC Data 폴더로 복사 스크립트
REM 출력 경로: C:\Users\HM_LT\NC\Data

setlocal enabledelayedexpansion

set OUTPUT_DIR=C:\Users\HM_LT\NC\Data
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

echo ========================================
echo ENSM 프로젝트 빌드 및 복사
echo ========================================
echo.

REM 출력 디렉토리 생성
if not exist "%OUTPUT_DIR%" (
    echo 출력 디렉토리 생성: %OUTPUT_DIR%
    mkdir "%OUTPUT_DIR%"
)

REM 기존 파일 삭제
echo 기존 파일 삭제 중...
if exist "%OUTPUT_DIR%\ensm-auth-*.jar" del /Q "%OUTPUT_DIR%\ensm-auth-*.jar"
if exist "%OUTPUT_DIR%\ensm-main-*.jar" del /Q "%OUTPUT_DIR%\ensm-main-*.jar"
echo.

REM ========================================
REM ensm-auth 빌드
REM ========================================
echo [1/2] ensm-auth 빌드 중...
cd ensm-auth
call gradlew.bat clean build -x test
if errorlevel 1 (
    echo ❌ ensm-auth 빌드 실패
    cd ..
    exit /b 1
)

REM ensm-auth JAR 파일 복사
echo ensm-auth JAR 파일 복사 중...
copy /Y build\libs\ensm-auth-0.0.1-SNAPSHOT.jar "%OUTPUT_DIR%\" >nul
if errorlevel 1 (
    echo ❌ ensm-auth JAR 복사 실패
    cd ..
    exit /b 1
)
echo ✅ ensm-auth 빌드 및 복사 완료
cd ..
echo.

REM ========================================
REM ensm-main 빌드
REM ========================================
echo [2/2] ensm-main 빌드 중...
cd ensm-main
call gradlew.bat clean build -x test
if errorlevel 1 (
    echo ❌ ensm-main 빌드 실패
    cd ..
    exit /b 1
)

REM ensm-main JAR 파일 복사
echo ensm-main JAR 파일 복사 중...
copy /Y build\libs\ensm-main-0.0.1-SNAPSHOT.jar "%OUTPUT_DIR%\" >nul
if errorlevel 1 (
    echo ❌ ensm-main JAR 복사 실패
    cd ..
    exit /b 1
)
echo ✅ ensm-main 빌드 및 복사 완료
cd ..
echo.

REM ========================================
REM 완료
REM ========================================
echo ========================================
echo ✅ 빌드 완료!
echo ========================================
echo.
echo 출력 위치: %OUTPUT_DIR%
echo.
dir /B "%OUTPUT_DIR%\ensm-*.jar"
echo.

endlocal

