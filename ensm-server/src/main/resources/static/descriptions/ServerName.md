### ServerName


Apache 웹 서버가 요청을 처리할 때 어떤 호스트 이름(도메인 또는 IP 주소)을 기준으로 응답할지를 지정하는 설정이다.

클라이언트가 보낸 HTTP 요청에는 `Host:`라는 헤더가 포함되며, Apache는 이 값과 `ServerName`을 비교하여 어떤 설정 블록(`<VirtualHost>`)을 적용할지를 결정한다.

`ServerName`은 서버를 식별하는 대표 주소이며, **필수적으로 하나만 설정해야** 한다.

도메인 기반 가상 호스트 운영에 반드시 필요하며, 명확히 지정하지 않으면 Apache는 부팅 시 경고를 출력하거나, 기본 설정을 잘못 적용할 수 있다.

```
ServerName www.example.com         // 일반적인 도메인 환경
ServerName localhost               // 개발 환경에서 테스트용
ServerName 192.168.0.10            // 사설 네트워크 기반 IP 지정
```

- `ServerName`에는 정규화된 도메인 이름(FQDN), 호스트 이름 또는 IP 주소를 사용할 수 있다.
- 하나의 `VirtualHost` 내에서는 반드시 하나만 지정해야 하며, 중복 선언 시 마지막 값만 적용된다.
- 여러 이름을 허용하고 싶을 경우 `ServerAlias`를 함께 사용해야 한다.

### 특수한 실수 및 표현 방식

- **포트번호 포함 금지**: `ServerName www.example.com:80` ❌ → 반드시 포트 번호 없이 도메인 또는 IP만 입력해야 함
    - 구문은 허용되지만 Apache는 포트를 무시함 → 포트 구분은 `<VirtualHost *:포트>`로 처리해야 함
- **중복 선언 금지**: `ServerName`을 한 파일 내 여러 번 선언하면 마지막 것만 유효
- **ServerAlias 없이 여러 이름 나열 금지**: 하나의 `ServerName`만 가능하며, 나머지는 `ServerAlias`로 설정해야 함

### 대표적인 오류 메시지 & 해결법

### 오류 코드

```
AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 127.0.1.1. Set the 'ServerName' directive globally to suppress this message.
```

### 발생 조건

- `httpd.conf` 또는 `/etc/apache2/apache2.conf`에 `ServerName`이 전혀 지정되지 않은 경우
- Apache가 현재 서버의 DNS 이름을 제대로 파악하지 못할 때

### 해결 방법

```
ServerName localhost
```

또는 실제 도메인 환경이라면:

```
ServerName www.example.com
```

- 이 설정은 **전역(global) 범위**에서, 즉 `httpd.conf` 최상단에 위치시키는 것이 가장 안전하다.