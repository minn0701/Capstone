### CustomLog

웹 서버에 들어온 요청에 대한 정보를 로그로 저장하는 설정이다. `ErrorLog`가 문제 상황을 기록한다면, `CustomLog`는 누가 언제 어떤 방식으로 접속했는지를 추적할 수 있게 해준다.

```
CustomLog "/var/log/httpd/access_log" combined    // combined 포맷으로 접속 로그 저장
CustomLog logs/access.log common                  // 상대 경로 + common 포맷

```

- 두 번째 인자는 로그 포맷 이름이며, 일반적으로 `combined` 또는 `common`을 사용
- `combined`는 IP, 사용자 정보, 시간, 요청 방식, 응답코드, 브라우저, 리퍼러까지 포함됨
- `common`은 브라우저/리퍼러 없이 기본 정보만 포함함