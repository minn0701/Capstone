### DefaultType


Apache가 MIME 타입을 결정할 수 없는 파일(확장자가 없거나, `AddType`/`TypesConfig`에 매핑이 없는 파일)을 처리할 때 사용할 기본 콘텐츠 타입을 지정한다.

이 설정은 Apache 2.4 이후 보안상 자동으로 비활성화되는 경우가 많지만, 명시적으로 지정해줄 수 있다.

```
DefaultType text/plain          // MIME 타입을 모를 경우 일반 텍스트로 처리
DefaultType application/octet-stream  // 바이너리로 처리 (다운로드 유도)
```

- `text/plain`: 브라우저에 텍스트 형태로 출력
- `application/octet-stream`: 브라우저가 다운로드하도록 유도
- Apache 최신 버전에서는 기본적으로 `DefaultType none`이며, 명시적으로 설정하지 않으면 사용되지 않을 수 있음

### 특수한 실수 및 표현 방식

- 보안상 이유로 HTML 파일 등이 `text/plain`으로 렌더링되어 코드가 그대로 노출될 수 있음
- `DefaultType`은 최후의 수단이며, 대부분의 콘텐츠는 `AddType` 또는 `TypesConfig`로 처리해야 한다