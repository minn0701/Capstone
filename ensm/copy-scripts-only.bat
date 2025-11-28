@echo off
chcp 65001 >nul
REM 스크립트만 RPM SOURCES로 복사 (빌드 없이)

echo ==========================================
echo 스크립트만 복사 (빌드 생략)
echo ==========================================
echo.

REM 이전 스크립트 폴더 삭제
if exist "ensm-rpm\SOURCES\ensm-scripts" (
    echo 이전 스크립트 폴더 삭제 중...
    rmdir /s /q "ensm-rpm\SOURCES\ensm-scripts"
)

REM 스크립트 복사
echo 스크립트 복사 중...
xcopy /E /I /Y "ensm-scripts" "ensm-rpm\SOURCES\ensm-scripts"

if errorlevel 1 (
    echo.
    echo 오류: 스크립트 복사 실패
    pause
    exit /b 1
)

echo.
echo ==========================================
echo 스크립트 복사 완료!
echo ==========================================
echo.
echo 다음 단계:
echo 1. ensm-rpm 폴더를 리눅스 서버로 복사
echo 2. 리눅스에서 다음 명령어 실행:
echo    cd ensm-rpm
echo    rpmbuild -ba SPECS/ensm.spec
echo.

pause

