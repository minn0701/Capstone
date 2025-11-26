# 서버 도메인명 (ServerName)

## 이 옵션이 하는 일

Apache가 자신을 식별하는 이름을 지정합니다. 이 이름은 도메인 이름(예: `example.com`) 또는 IP 주소(예: `192.168.1.100`)로 설정할 수 있습니다. 클라이언트가 서버에 접속할 때 사용하는 주소입니다.

## 왜 필요한가요?

- **가상 호스트 구분**: 여러 웹사이트를 운영할 때 각 사이트를 구분
- **리다이렉션**: URL을 올바른 주소로 자동 이동
- **로그 기록**: 접속 로그에 정확한 서버 이름 기록

## 설정 방법

### 도메인 이름 사용 (권장)
```
example.com
www.example.com
```

### IP 주소 사용
```
192.168.1.100
```

### localhost (개발 환경)
```
localhost
127.0.0.1
```

## 예시

```
example.com              → 메인 도메인
www.example.com         → www 서브도메인
api.example.com         → API 서브도메인
192.168.1.100          → 로컬 네트워크 IP
localhost               → 로컬 개발 환경
```

## 알아야 할 것들

### 도메인과 IP 주소의 차이

- **도메인 이름**: 사람이 읽기 쉬운 주소 (예: `example.com`)
- **IP 주소**: 컴퓨터가 사용하는 숫자 주소 (예: `192.168.1.100`)

도메인 이름을 사용하면 IP 주소가 변경되어도 도메인만 유지하면 됩니다.

### 가상 호스트와의 관계

여러 웹사이트를 운영할 때는 각 사이트마다 다른 `ServerName`을 설정합니다:

```apache
<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/example
</VirtualHost>

<VirtualHost *:80>
    ServerName another.com
    DocumentRoot /var/www/another
</VirtualHost>
```

### DNS 설정

도메인 이름을 사용하려면 DNS 설정이 필요합니다:
- 도메인을 서버의 IP 주소로 가리키도록 설정
- A 레코드 또는 CNAME 레코드 추가

## 자주 발생하는 오류

### "Could not reliably determine the server's fully qualified domain name"
**원인**: ServerName이 설정되지 않았거나 잘못 설정됨

**해결 방법**: 
- 올바른 도메인 이름 또는 IP 주소를 입력하세요
- 개발 환경에서는 `localhost`를 사용할 수 있습니다

### 도메인으로 접속이 안 됨
**확인 사항**:
1. DNS 설정이 올바른지 확인 (`nslookup example.com`)
2. 도메인이 서버의 IP 주소를 가리키는지 확인
3. 방화벽에서 포트가 열려있는지 확인

### IP 주소는 되는데 도메인은 안 됨
**원인**: DNS 설정 문제 또는 도메인 등록 문제

**해결 방법**:
1. DNS 전파 시간 대기 (최대 48시간)
2. DNS 설정 확인
3. 임시로 `/etc/hosts` 파일에 도메인 추가 (로컬 테스트용)
