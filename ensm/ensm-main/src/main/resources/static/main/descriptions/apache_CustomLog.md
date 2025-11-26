# 접속 로그 설정 (CustomLog)

## 이 옵션이 하는 일

웹사이트에 접속한 모든 요청을 기록하는 접속 로그(액세스 로그)의 저장 위치와 형식을 지정합니다. 누가, 언제, 어떤 페이지에 접속했는지 추적할 수 있습니다.

## 기본값

- **기본값**: `logs/access_log common` (상대 경로, common 로그 형식)
- **절대 경로 예시**: `/var/log/apache2/access.log` (Ubuntu/Debian)

## 로그 형식 옵션

### common
- **의미**: 표준 Common Log Format (CLF)
- **기록 내용**: IP 주소, 사용자명, 날짜/시간, 요청, 상태 코드, 크기
- **예시**: `192.168.1.100 - - [15/Jan/2024:10:30:45 +0900] "GET /index.html HTTP/1.1" 200 1234`

### combined
- **의미**: 확장된 로그 형식 (추천)
- **기록 내용**: common 형식 + Referer + User-Agent
- **예시**: `192.168.1.100 - - [15/Jan/2024:10:30:45 +0900] "GET /index.html HTTP/1.1" 200 1234 "http://example.com/referrer" "Mozilla/5.0..."`

### referer
- **의미**: 참조 페이지 정보만
- **기록 내용**: 어디서 왔는지 (Referer)

### agent
- **의미**: 사용자 에이전트(브라우저) 정보만
- **기록 내용**: 브라우저 종류, 버전

## 설정 예시

### 표준 경로 (common 형식)
```
/var/log/apache2/access.log common
/var/log/httpd/access_log common
```

### 확장 형식 (권장)
```
/var/log/apache2/access.log combined
/var/log/apache2/access.log "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\""
```

### 사용자 정의 형식
```
/var/log/apache2/access.log "%h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\" %D"
```
→ 추가로 응답 시간(%D) 기록

### 여러 로그 파일
```
/var/log/apache2/access.log combined
/var/log/apache2/referer.log referer
/var/log/apache2/agent.log agent
```

## 로그 형식 코드 설명

사용자 정의 형식에서 사용할 수 있는 코드:

- `%h`: 클라이언트 IP 주소
- `%l`: 사용자명 (보통 `-`)
- `%u`: 인증된 사용자명
- `%t`: 요청 시간
- `%r`: 요청 라인 (메서드, URL, 프로토콜)
- `%>s`: 응답 상태 코드
- `%b`: 전송된 바이트 수
- `%{Referer}i`: 참조 페이지
- `%{User-Agent}i`: 브라우저 정보
- `%D`: 요청 처리 시간 (마이크로초)

## 알아야 할 것들

### 로그 파일 크기

접속 로그는 매우 빠르게 커질 수 있습니다:
- **소규모 사이트**: 수십 MB/일
- **중규모 사이트**: 수백 MB ~ 수 GB/일
- **대규모 사이트**: 수십 GB/일

로그 로테이션이 필수입니다.

### 로그 로테이션 설정

```bash
# logrotate 설정 예시
/var/log/apache2/access.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
    sharedscripts
    postrotate
        /usr/sbin/apache2ctl graceful
    endscript
}
```

### 개인정보 보호

접속 로그에는 IP 주소, 브라우저 정보 등이 기록됩니다. GDPR 등 개인정보 보호 규정을 준수해야 합니다:
- 로그 보관 기간 제한
- 필요시 IP 주소 마스킹
- 정기적인 로그 삭제

### 로그 분석 도구

접속 로그를 분석하는 도구들:
- **AWStats**: 무료 웹 로그 분석 도구
- **GoAccess**: 실시간 로그 분석
- **ELK Stack**: 대규모 로그 분석

## 자주 발생하는 오류

### 로그 파일이 너무 빠르게 커짐
**원인**: 대량의 트래픽, 로그 로테이션 미설정

**해결 방법**:
1. 로그 로테이션 설정
2. 로그 형식을 간소화 (common 사용)
3. 특정 요청만 로깅 (조건부 로깅)

### 디스크 공간 부족
**원인**: 로그 파일이 계속 커짐

**해결 방법**:
1. 즉시 로그 로테이션 설정
2. 오래된 로그 파일 삭제
3. 로그를 다른 디스크로 이동

### 로그에 기록되지 않음
**확인 사항**:
1. 경로가 올바른지 확인
2. 파일 쓰기 권한 확인
3. Apache가 정상 실행 중인지 확인

### 로그 형식이 이상함
**원인**: 형식 문자열 오류

**해결 방법**:
- 표준 형식(common, combined) 사용 권장
- 사용자 정의 형식은 신중하게 작성
