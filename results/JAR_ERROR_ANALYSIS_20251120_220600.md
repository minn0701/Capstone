# ensm-main.jar 오류 분석

**생성일시**: 2025-11-20 22:06:00

## 오류 내용

```
Exception in thread "main" java.lang.NegativeArraySizeException: -12167
        at org.springframework.boot.loader.zip.ZipContent$Loader.<init>(ZipContent.java:435)
```

## 오류 분석

### 1. 오류 발생 위치
- **클래스**: `org.springframework.boot.loader.zip.ZipContent$Loader`
- **메서드**: 생성자 (`<init>`)
- **라인**: 435
- **오류 타입**: `NegativeArraySizeException: -12167`

### 2. 스택 트레이스 분석

오류는 다음 순서로 발생합니다:

1. **JarLauncher.main()** - Spring Boot JAR 실행 시작
2. **Launcher.launch()** - 런처 초기화
3. **Class.forName()** - 클래스 로딩 시도
4. **JarUrlClassLoader.loadClass()** - JAR에서 클래스 로드
5. **JarUrlConnection.connect()** - JAR 파일 연결
6. **UrlJarFileFactory.createJarFile()** - JAR 파일 생성
7. **NestedJarFile 생성** - 중첩된 JAR 파일 처리
8. **ZipContent.open()** - ZIP 내용 읽기
9. **ZipContent$Loader.<init>()** - ZIP 로더 초기화 중 **오류 발생**

### 3. 원인 분석

#### A. JAR 파일 손상 가능성 (가장 가능성 높음)

`NegativeArraySizeException: -12167`는 배열 크기로 음수 값(-12167)을 읽었다는 의미입니다. 이는:

1. **ZIP 파일 헤더 손상**: 
   - ZIP 파일의 Central Directory나 Local File Header가 손상됨
   - 파일 크기 필드가 잘못된 값으로 읽힘

2. **중첩된 JAR 파일 손상**:
   - Spring Boot는 JAR 내부에 `BOOT-INF/lib/` 폴더에 의존성 JAR들을 포함
   - 이 중 하나 이상의 JAR 파일이 손상되었을 가능성

3. **파일 전송 중 손상**:
   - Windows에서 Linux로 파일 전송 시 바이너리 모드가 아닌스트 모드로 전송
   - 네트워크 전송 중 데이터 손실

#### B. 빌드 과정 문제

1. **React 빌드 파일 문제**:
   - React 빌드가 완료되지 않았거나 불완전한 상태에서 JAR에 포함
   - `copyReactBuildFiles` 태스크가 손상된 파일을 복사

2. **Gradle 빌드 중단**:
   - 빌드가 중간에 중단되어 불완전한 JAR 생성
   - 멀티 프로젝트 빌드에서 의존성 문제

#### C. 파일 시스템 문제

1. **디스크 오류**:
   - 리눅스 서버의 디스크 오류로 파일이 손상
   - 파일 시스템 오류

2. **권한 문제**:
   - 파일 쓰기 권한 부족으로 불완전한 파일 생성

### 4. 확인 사항

#### 즉시 확인해야 할 것들:

1. **로컬 JAR 파일 무결성**:
   ```bash
   # Windows에서
   jar tf ensm-rpm\SOURCES\ensm-main-0.0.1-SNAPSHOT.jar | head -50
   ```

2. **리눅스 서버의 JAR 파일**:
   ```bash
   # 리눅스에서
   ls -lh /opt/ensm/ensm-main.jar
   md5sum /opt/ensm/ensm-main.jar
   unzip -t /opt/ensm/ensm-main.jar 2>&1 | head -100
   ```

3. **JAR 파일 크기 비교**:
   - 로컬 빌드된 JAR 크기
   - 리눅스 서버의 JAR 크기
   - 크기가 다르면 전송 중 손상 가능성

4. **빌드 로그 확인**:
   - React 빌드가 성공적으로 완료되었는지
   - JAR 파일 생성 시 오류가 없었는지

### 5. 해결 방법

#### 방법 1: 완전한 재빌드 및 재배포

1. **로컬에서 완전한 clean 빌드**:
   ```bash
   cd ensm
   gradlew clean
   .\build-for-rpm.bat
   ```

2. **JAR 파일 무결성 확인**:
   ```bash
   # Windows에서
   jar tf ensm-rpm\SOURCES\ensm-main-0.0.1-SNAPSHOT.jar > jar-contents.txt
   # 파일 목록이 정상적으로 출력되는지 확인
   ```

3. **바이너리 모드로 전송**:
   ```bash
   # scp 사용 시 (이미 바이너리 모드)
   scp ensm-rpm/SOURCES/ensm-main-0.0.1-SNAPSHOT.jar user@server:/tmp/
   
   # 또는 rsync 사용
   rsync -avz ensm-rpm/SOURCES/ensm-main-0.0.1-SNAPSHOT.jar user@server:/tmp/
   ```

4. **리눅스에서 무결성 확인 후 설치**:
   ```bash
   # 리눅스에서
   unzip -t /tmp/ensm-main-0.0.1-SNAPSHOT.jar
   # 오류가 없으면
   sudo cp /tmp/ensm-main-0.0.1-SNAPSHOT.jar /opt/ensm/ensm-main.jar
   sudo chown ensm:ensm /opt/ensm/ensm-main.jar
   ```

#### 방법 2: 빌드 과정 개선

1. **빌드 후 자동 검증 추가**:
   ```groovy
   task verifyJar(type: Exec) {
       dependsOn build
       doFirst {
           def jarFile = file("build/libs/ensm-main-0.0.1-SNAPSHOT.jar")
           if (!jarFile.exists()) {
               throw new GradleException("JAR 파일이 생성되지 않았습니다")
           }
           // JAR 파일 내용 확인
           exec {
               commandLine 'jar', 'tf', jarFile.absolutePath
           }
       }
   }
   ```

2. **React 빌드 검증 강화**:
   - 빌드 후 `build` 폴더의 모든 파일 검증
   - `index.html` 외에도 주요 파일 존재 확인

#### 방법 3: 파일 전송 검증

1. **MD5 체크섬 비교**:
   ```bash
   # Windows에서
   certutil -hashfile ensm-rpm\SOURCES\ensm-main-0.0.1-SNAPSHOT.jar MD5
   
   # 리눅스에서
   md5sum /opt/ensm/ensm-main.jar
   ```

2. **전송 후 즉시 검증**:
   ```bash
   # 전송 후 리눅스에서
   unzip -t /opt/ensm/ensm-main.jar
   ```

### 6. 예상 원인 우선순위

1. **가장 가능성 높음**: 파일 전송 중 손상 또는 불완전한 빌드
2. **두 번째**: React 빌드 파일이 손상된 상태로 JAR에 포함
3. **세 번째**: 리눅스 서버의 디스크/파일 시스템 문제

### 7. 다음 단계

1. **로컬 JAR 파일 무결성 확인**
2. **리눅스 서버의 JAR 파일과 비교**
3. **완전한 재빌드 및 재배포**
4. **전송 후 즉시 무결성 검증**

