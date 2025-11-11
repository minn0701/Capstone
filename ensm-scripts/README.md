# ENSM Scripts

이 폴더는 ENSM 시스템에서 사용하는 모든 쉘 스크립트를 관리합니다.

## ⚠️ 중요: 배포 방법

**JAR 파일에는 스크립트가 포함되지 않습니다!**

스크립트는 JAR 파일과 **별도로** 서버에 배포되어야 합니다.

### 배포 방법

1. **자동 배포** (권장):
   ```bash
   cd Capstone
   ./ensm-scripts/deploy.sh
   ```

2. **수동 배포**:
   ```bash
   # 스크립트 폴더를 서버에 전송
   scp -r -P 999 ensm-scripts/ sa@minn0701.iptime.org:/usr/local/bin/ensm-scripts
   
   # 서버에서 실행 권한 부여
   ssh -p 999 sa@minn0701.iptime.org
   sudo chmod +x /usr/local/bin/ensm-scripts/*/*.sh
   ```

### 서버 디렉토리 구조

서버에 배포된 후:

```
/usr/local/bin/ensm-scripts/
├── apache/
│   └── configure_apache.sh
├── bind/
│   └── configure_bind.sh
├── system/
├── network/
├── security/
└── utils/
```

## 구조

```
ensm-scripts/
├── apache/          # Apache 웹서버 관련 스크립트
├── bind/            # BIND DNS 서버 관련 스크립트
├── system/          # 시스템 관리 관련 스크립트
├── network/         # 네트워크 관리 관련 스크립트
├── security/        # 보안 관련 스크립트
├── utils/           # 유틸리티 스크립트
└── deploy.sh        # 배포 스크립트
```

## 스크립트 작성 규칙

1. **권한**: 모든 스크립트는 실행 권한이 있어야 합니다 (`chmod +x script.sh`)
2. **Shebang**: 모든 스크립트는 `#!/bin/bash`로 시작해야 합니다
3. **에러 처리**: 스크립트는 적절한 에러 처리를 포함해야 합니다
4. **로깅**: 중요한 작업은 로그를 남겨야 합니다
5. **보안**: 사용자 입력은 항상 검증해야 합니다
6. **사용자**: 스크립트는 `ensm` 사용자 또는 `root` 권한으로 실행될 수 있어야 합니다

## 스크립트 호출 방식

Java 백엔드에서 스크립트를 호출할 때는 다음과 같은 패턴을 사용합니다:

```java
ProcessBuilder pb = new ProcessBuilder(
    "/usr/local/bin/ensm-scripts/apache/configure_apache.sh",
    "arg1", "arg2", ...
);
```

스크립트 경로는 `SystemConfig`에서 관리되며, 웹 UI (`/main/ensm/settings`)에서 변경할 수 있습니다.

## 기본 경로 설정

- **기본 경로**: `/usr/local/bin/ensm-scripts`
- **Apache 스크립트**: `/usr/local/bin/ensm-scripts/apache/configure_apache.sh`
- **BIND 스크립트**: `/usr/local/bin/ensm-scripts/bind/configure_bind.sh`

경로는 `config/ensm-config.yml` 파일에서 관리되며, 웹 UI에서 변경 가능합니다.

## 예시

### Apache 설정 스크립트
```bash
#!/bin/bash
# ensm-scripts/apache/configure_apache.sh

# Apache 설정 파일 수정
# 인자: 설정 키, 설정 값
# 예: ./configure_apache.sh ServerName www.example.com

CONFIG_FILE="/etc/httpd/conf/httpd.conf"
KEY=$1
VALUE=$2

# 설정 파일 백업
cp "$CONFIG_FILE" "${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# 설정 수정
sed -i "s/^#*${KEY}.*/${KEY} ${VALUE}/" "$CONFIG_FILE"

# 설정 검증
httpd -t && systemctl reload httpd
```

