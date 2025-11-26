# 빌드 스크립트 재구성 완료 리포트

**생성일시**: 2025-11-20 21:57:33

## ✅ 생성된 파일

### Gradle 설정 파일
1. ✅ `ensm/settings.gradle` - 멀티 프로젝트 설정
2. ✅ `ensm/build.gradle` - 루트 빌드 설정 (JAR 복사, 스크립트 복사 태스크 포함)
3. ✅ `ensm/ensm-auth/build.gradle` - ensm-auth 빌드 설정 (프론트엔드 빌드 포함)
4. ✅ `ensm/ensm-main/build.gradle` - ensm-main 빌드 설정 (프론트엔드 빌드 포함)
5. ✅ `ensm/ensm-auth/settings.gradle` - ensm-auth 서브프로젝트 설정
6. ✅ `ensm/ensm-main/settings.gradle` - ensm-main 서브프로젝트 설정
7. ✅ `ensm/gradle/wrapper/gradle-wrapper.properties` - Gradle wrapper 설정
8. ✅ `ensm/gradlew` - Linux/Mac용 Gradle wrapper 스크립트
9. ✅ `ensm/gradlew.bat` - Windows용 Gradle wrapper 스크립트

### 빌드 스크립트
1. ✅ `ensm/build-for-rpm.sh` - Linux/Mac용 RPM 빌드 준비 스크립트
2. ✅ `ensm/build-for-rpm.bat` - Windows용 RPM 빌드 준비 스크립트

---

## 📋 빌드 프로세스

### 1. 빌드 스크립트 실행
```bash
# Windows
build-for-rpm.bat

# Linux/Mac
chmod +x build-for-rpm.sh
./build-for-rpm.sh
```

### 2. 빌드 스크립트가 수행하는 작업
1. **이전 JAR 파일 삭제**
   - `ensm-rpm/SOURCES/ensm-auth-0.0.1-SNAPSHOT.jar`
   - `ensm-rpm/SOURCES/ensm-main-0.0.1-SNAPSHOT.jar`

2. **이전 ensm-scripts 복사본 삭제**
   - `ensm-rpm/SOURCES/ensm-scripts/`

3. **Gradle 빌드 실행**
   - `./gradlew clean buildForRpm`
   - ensm-auth 빌드 (프론트엔드 포함)
   - ensm-main 빌드 (프론트엔드 포함)
   - JAR 파일을 `ensm-rpm/SOURCES/`로 복사
   - ensm-scripts를 `ensm-rpm/SOURCES/ensm-scripts/`로 복사

### 3. RPM 빌드 (리눅스 서버에서)
```bash
cd ensm-rpm
rpmbuild -ba SPECS/ensm.spec
```

---

## 📁 파일 구조

### 빌드 전
```
ensm/
├── ensm-auth/
│   └── src/main/exserver/  (프론트엔드 소스)
├── ensm-main/
│   └── src/main/resources/static/main/src/  (프론트엔드 소스)
└── ensm-scripts/
```

### 빌드 후 (ensm-rpm/SOURCES/)
```
ensm-rpm/SOURCES/
├── ensm-auth-0.0.1-SNAPSHOT.jar  ✅ (빌드된 JAR)
├── ensm-main-0.0.1-SNAPSHOT.jar  ✅ (빌드된 JAR)
└── ensm-scripts/                 ✅ (스크립트 복사본)
    ├── system/
    │   ├── run_script.c
    │   ├── ensm-postinstall.sh
    │   └── ...
    ├── apache/
    ├── bind/
    └── ...
```

---

## 🔧 Gradle 태스크

### 주요 태스크
- `./gradlew buildAll` - 모든 서브프로젝트 빌드
- `./gradlew cleanRpmJars` - 이전 JAR 파일 삭제
- `./gradlew copyJarsToRpmSources` - JAR 파일 복사
- `./gradlew copyScriptsToRpmSources` - 스크립트 복사
- `./gradlew buildForRpm` - 전체 빌드 및 복사 (권장)

---

## 📝 참고사항

### ensm-scripts 포함 방식
- 스펙 파일 75줄: `cp -r %{_sourcedir}/ensm-scripts/* %{buildroot}/usr/local/bin/ensm-scripts/`
- `ensm-rpm/SOURCES/ensm-scripts/` 폴더 전체가 RPM에 포함됨
- 빌드 스크립트가 자동으로 복사

### 프론트엔드 빌드
- **ensm-auth**: `src/main/exserver/` → `npm run build` → `src/main/resources/static/`
- **ensm-main**: `src/main/resources/static/main/src/` → `npm run build` → `src/main/resources/static/main/`
- Gradle 빌드 시 자동으로 프론트엔드 빌드 후 JAR에 포함

### Gradle Wrapper
- `gradle-wrapper.jar` 파일이 필요함
- 첫 실행 시 자동 다운로드 또는 수동 다운로드 필요
- Gradle 8.5 사용

---

## ⚠️ 주의사항

1. **Gradle Wrapper JAR**: `gradle/wrapper/gradle-wrapper.jar` 파일이 필요합니다.
   - 첫 실행 시 자동 다운로드되거나
   - 수동으로 다운로드 필요: https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar

2. **Node.js 필요**: 프론트엔드 빌드를 위해 Node.js와 npm이 필요합니다.

3. **Java 21 필요**: 프로젝트가 Java 21을 사용합니다.

---

## 🎯 다음 단계

1. **Gradle Wrapper JAR 다운로드** (필요 시)
2. **빌드 테스트**: `./gradlew buildForRpm` 실행
3. **RPM 빌드**: 리눅스 서버에서 `rpmbuild -ba SPECS/ensm.spec`

