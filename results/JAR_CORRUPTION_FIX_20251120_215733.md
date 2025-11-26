# ensm-main.jar 손상 문제 해결 가이드

**생성일시**: 2025-11-20 21:57:33

## 문제 진단

로그 분석 결과:
- **ensm-auth**: ✅ 정상 작동 (포트 55556에서 실행 중)
- **ensm-main**: ❌ JAR 파일 손상으로 시작 실패

### 오류 메시지
```
Exception in thread "main" java.lang.NegativeArraySizeException: -14101
at org.springframework.boot.loader.zip.ZipContent$Loader.<init>
```

이 오류는 **JAR 파일의 ZIP 구조가 손상**되었을 때 발생합니다.

---

## 원인 분석

가능한 원인:
1. **React 빌드 실패 후 빌드 폴더 없이 JAR 생성**: `ignoreExitValue = true`로 인해 React 빌드가 실패해도 JAR가 생성됨
2. **빌드 과정 중단**: 빌드 중 파일이 손상됨
3. **파일 전송 중 손상**: Windows → Linux 전송 중 문제
4. **descriptions 폴더 복사 문제**: 대용량 파일 복사 중 문제

---

## 해결 방법

### 1. Windows에서 깨끗한 재빌드

```cmd
cd C:\Users\HM_LT\Desktop\Capstone\ensm

REM 기존 빌드 파일 완전 삭제
rmdir /s /q ensm-main\build
rmdir /s /q ensm-main\src\main\resources\static\main\build
del /f ensm-rpm\SOURCES\ensm-main-0.0.1-SNAPSHOT.jar

REM React 소스 빌드 폴더도 삭제 (선택사항)
rmdir /s /q ensm-main\src\main\resources\static\main\src\build

REM Gradle 완전 정리
gradlew clean

REM 재빌드
.\build-for-rpm.bat
```

### 2. 빌드 과정 확인

빌드 중 다음을 확인:
- React 빌드가 성공적으로 완료되었는지
- JAR 파일 크기가 정상적인지 (약 80-100MB)
- 빌드 중 오류 메시지가 없는지

### 3. JAR 파일 무결성 확인

리눅스에서:
```bash
# JAR 파일이 유효한 ZIP 파일인지 확인
unzip -t /opt/ensm/ensm-main.jar

# 또는
jar tf /opt/ensm/ensm-main.jar | head -20

# 파일 크기 확인
ls -lh /opt/ensm/ensm-main.jar
```

### 4. 수동 빌드 (대안)

Gradle 빌드가 계속 실패하면:
```cmd
cd ensm-main
gradlew clean build --no-daemon --stacktrace
```

빌드된 JAR를 수동으로 복사:
```cmd
copy ensm-main\build\libs\ensm-main-0.0.1-SNAPSHOT.jar ensm-rpm\SOURCES\
```

---

## 수정 사항

### build.gradle 수정

1. **buildReact 태스크**: `ignoreExitValue = true` 제거 - React 빌드 실패 시 중단
2. **copyReactBuildFiles 태스크**: 빌드 폴더 존재 여부 확인 추가 - 빌드 폴더가 없으면 오류 발생

이렇게 하면 React 빌드가 실패하거나 완료되지 않았을 때 JAR 파일이 생성되지 않아 손상된 JAR를 방지할 수 있습니다.

---

## 예방 조치

1. **빌드 전 확인**: React 빌드가 성공적으로 완료되었는지 확인
2. **JAR 파일 검증**: 빌드 후 JAR 파일 무결성 확인
3. **파일 전송 확인**: 전송 후 파일 크기 및 무결성 확인
4. **빌드 로그 확인**: 빌드 과정에서 오류가 없는지 확인

---

## 다음 단계

1. Windows에서 위의 재빌드 명령어 실행
2. 빌드 완료 후 JAR 파일 크기 확인
3. 리눅스로 전송
4. 리눅스에서 JAR 파일 무결성 확인
5. 서비스 재시작

