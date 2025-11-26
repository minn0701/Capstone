@echo off
chcp 65001 >nul
REM ENSM RPM 빌드를 위한 전체 빌드 스크립트 (Windows)
REM 
REM 사용법: build-for-rpm.bat
REM 
REM 작업 내용:
REM 1. 이전 JAR 파일 삭제
REM 2. ensm-auth 빌드 (프론트엔드 포함)
REM 3. ensm-main 빌드 (프론트엔드 포함)
REM 4. JAR 파일을 ensm-rpm/SOURCES로 복사
REM 5. ensm-scripts를 ensm-rpm/SOURCES로 복사

echo ==========================================
echo ENSM RPM 빌드 준비 시작
echo ==========================================

REM Gradle wrapper JAR 파일 확인 및 다운로드
if not exist "gradle\wrapper\gradle-wrapper.jar" (
    echo.
    echo Gradle wrapper JAR 파일이 없습니다. 다운로드 중...
    powershell -ExecutionPolicy Bypass -File "%~dp0download-gradle-wrapper.ps1"
    if errorlevel 1 (
        echo 오류: Gradle wrapper JAR 다운로드 실패
        echo 수동으로 다운로드하세요: https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar
        pause
        exit /b 1
    )
)

REM Gradle 빌드 (자동으로 이전 파일 삭제 및 복사 수행)
echo.
echo Gradle 빌드 시작...
echo   - 이전 JAR 파일 및 스크립트 폴더 삭제
echo   - ensm-auth 빌드 (프론트엔드 포함)
echo   - ensm-main 빌드 (프론트엔드 포함)
echo   - JAR 파일을 ensm-rpm\SOURCES로 복사
echo   - ensm-scripts를 ensm-rpm\SOURCES\ensm-scripts로 복사
echo.
REM 현재 디렉토리 확인 및 gradlew.bat 경로 확인
if not exist "gradlew.bat" (
    echo 오류: gradlew.bat 파일을 찾을 수 없습니다.
    echo 현재 디렉토리: %CD%
    pause
    exit /b 1
)

if not exist "gradle\wrapper\gradle-wrapper.jar" (
    echo 오류: gradle-wrapper.jar 파일을 찾을 수 없습니다.
    echo 현재 디렉토리: %CD%
    pause
    exit /b 1
)

call gradlew.bat clean buildForRpm
if errorlevel 1 (
    echo.
    echo 오류: Gradle 빌드 실패
    pause
    exit /b 1
)
echo.
echo Gradle 빌드 완료

echo.
echo ==========================================
echo ENSM RPM 빌드 준비 완료!
echo ==========================================
echo.
echo 다음 단계:
echo 1. ensm-rpm 폴더를 리눅스 서버로 복사
echo 2. 리눅스에서 다음 명령어 실행:
echo    cd ensm-rpm
echo    rpmbuild -ba SPECS/ensm.spec
echo.

pause
