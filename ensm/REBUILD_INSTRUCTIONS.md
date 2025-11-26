# ensm-main.jar 재빌드 가이드

## 문제
ensm-main.jar 파일이 손상되어 `NegativeArraySizeException` 오류 발생

## 해결 방법

### 1. Windows에서 깨끗한 재빌드

```cmd
cd C:\Users\HM_LT\Desktop\Capstone\ensm

REM 기존 빌드 파일 삭제
rmdir /s /q ensm-main\build
rmdir /s /q ensm-main\src\main\resources\static\main\build
del /f ensm-rpm\SOURCES\ensm-main-0.0.1-SNAPSHOT.jar

REM React 빌드 폴더도 삭제 (선택사항)
rmdir /s /q ensm-main\src\main\resources\static\main\src\build

REM Gradle 캐시 정리
gradlew clean

REM 재빌드
.\build-for-rpm.bat
```

### 2. JAR 파일 무결성 확인

리눅스에서:
```bash
# JAR 파일이 유효한 ZIP 파일인지 확인
unzip -t /opt/ensm/ensm-main.jar

# 또는
jar tf /opt/ensm/ensm-main.jar | head -20
```

### 3. 빌드 과정 확인

Windows 빌드 시 다음을 확인:
- React 빌드가 성공적으로 완료되었는지
- JAR 파일 크기가 정상적인지 (약 80-100MB)
- 빌드 중 오류 메시지가 없는지

### 4. 파일 전송 확인

리눅스로 전송할 때:
```bash
# 파일 크기 확인
ls -lh ensm-rpm/SOURCES/ensm-main-0.0.1-SNAPSHOT.jar

# 전송 후 확인
ls -lh /opt/ensm/ensm-main.jar
```

### 5. 수동 빌드 (대안)

Gradle 빌드가 실패하면:
```cmd
cd ensm-main
gradlew clean build --no-daemon
```

빌드된 JAR를 수동으로 복사:
```cmd
copy ensm-main\build\libs\ensm-main-0.0.1-SNAPSHOT.jar ensm-rpm\SOURCES\
```

