### AllowOverride


`.htaccess` 파일을 통해 디렉토리별로 개별 설정을 덮어쓸 수 있도록 허용하는 설정이다. 이 지시어를 통해 보안, URL 재작성, 인증 등 설정을 현장 수정 가능하게 만들 수 있다.

```
AllowOverride None            // .htaccess 사용 불가
AllowOverride All             // 모든 지시어 허용
AllowOverride AuthConfig FileInfo // 인증/파일정보 지시어만 허용

```

- `AllowOverride None`으로 설정하면 `.htaccess` 파일을 무시하게 되며, 이는 성능 향상에 좋음
- 설정 가능한 항목: `All`, `None`, `AuthConfig`, `FileInfo`, `Indexes`, `Limit`, `Options`
- `.htaccess` 파일을 사용할 디렉토리에서는 반드시 이 옵션이 적절히 지정되어 있어야 한다.