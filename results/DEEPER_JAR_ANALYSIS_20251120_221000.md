# ensm-main.jar 심층 분석

**생성일시**: 2025-11-20 22:10:00

## 확인된 사실

1. **MD5 체크섬 일치**: 
   - Windows: `b306739e950d367681b12ac4bc6d16ed`
   - Linux: `b306739e950d367681b12ac4bc6d16ed`
   - ✅ 파일 전송 중 손상 없음

2. **ZIP 구조 검증 통과**:
   - `unzip -t` 결과 모든 파일 OK
   - ✅ 기본 ZIP 구조는 정상

3. **그러나 여전히 오류 발생**:
   - `NegativeArraySizeException: -12167`
   - Spring Boot Loader가 중첩된 JAR를 읽을 때 실패

## 추가 검증 필요

### 1. 중첩된 JAR 파일 개별 검증

리눅스 서버에서 다음 명령어 실행:

```bash
# JAR 파일 내부 구조 확인
jar tf /opt/ensm/ensm-main.jar | grep "BOOT-INF/lib/" | head -20

# 중첩된 JAR 파일들 추출 및 검증
cd /tmp
mkdir jar-test
cd jar-test
jar xf /opt/ensm/ensm-main.jar BOOT-INF/lib/

# 각 JAR 파일 검증
for jar in BOOT-INF/lib/*.jar; do
    echo "Testing: $jar"
    unzip -t "$jar" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "ERROR: $jar is corrupted!"
    fi
done
```

### 2. Java 버전 확인

```bash
# 리눅스 서버에서
/opt/ensm/java/jdk/bin/java -version
```

### 3. Spring Boot Loader 버전 확인

```bash
# JAR 파일에서 Spring Boot 버전 확인
unzip -p /opt/ensm/ensm-main.jar META-INF/MANIFEST.MF | grep -i "spring-boot"
```

### 4. 특정 중첩된 JAR 파일 문제 가능성

Spring Boot Loader가 특정 의존성 JAR를 읽을 때 문제가 발생할 수 있습니다. 특히:
- 큰 파일 크기의 JAR
- 특정 패키징 방식의 JAR
- React 빌드 파일이 포함된 부분

## 가능한 원인

### 1. Spring Boot Loader 버전 호환성 문제

특정 Spring Boot 버전의 Loader가 큰 JAR 파일이나 특정 구조의 중첩된 JAR를 처리하지 못할 수 있습니다.

### 2. Java 버전 호환성

Java 21과 Spring Boot Loader의 특정 버전 조합에서 문제가 발생할 수 있습니다.

### 3. 중첩된 JAR 중 하나의 문제

`BOOT-INF/lib/` 내부의 특정 JAR 파일이 손상되었거나 호환되지 않는 형식일 수 있습니다.

### 4. React 빌드 파일 문제

`BOOT-INF/classes/static/main/` 내부의 React 빌드 파일 중 하나가 문제를 일으킬 수 있습니다.

## 해결 방법

### 방법 1: 중첩된 JAR 개별 검증

위의 스크립트로 문제가 있는 JAR 파일을 찾아 제거하거나 교체

### 방법 2: Spring Boot 버전 업데이트

`build.gradle`에서 Spring Boot 버전을 최신으로 업데이트

### 방법 3: JAR 파일 재패키징

```bash
# 리눅스에서
cd /tmp
mkdir repackage
cd repackage
jar xf /opt/ensm/ensm-main.jar

# 문제가 있는 JAR 제거 후 재패키징
jar cfm ensm-main-new.jar META-INF/MANIFEST.MF -C . .
```

### 방법 4: 로그 레벨 증가

더 자세한 오류 정보를 얻기 위해:

```bash
# systemd 서비스에 환경 변수 추가
# /usr/lib/systemd/system/ensm-main.service
Environment="JAVA_OPTS=-Xms512m -Xmx1024m -Dloader.debug=true"
```

## 다음 단계

1. **중첩된 JAR 파일 개별 검증** 실행
2. **Java 버전 확인**
3. **Spring Boot 버전 확인**
4. **더 자세한 로그 수집**

