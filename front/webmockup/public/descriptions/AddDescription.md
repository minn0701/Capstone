### AddDescription

## # AddDescription

디렉토리 인덱싱이 활성화되어 있을 때(`Options Indexes`) 각 파일에 대한 짧은 설명을 함께 표시할 수 있도록 하는 지시어다. `IndexOptions`와 함께 사용되며, 파일명이나 확장자 패턴에 따라 설명 텍스트를 매핑할 수 있다.

```
AddDescription "이미지 파일" .jpg .jpeg .png
AddDescription "압축 파일" .zip .tar .gz
```

- `.jpg`, `.png` 등의 확장자를 가진 파일 옆에 “이미지 파일”이라는 설명이 표시됨
- 설명 문자열은 따옴표로 감싸야 하며, 여러 확장자에 같은 설명을 부여할 수 있음
- `AddDescription`은 `IndexOptions DescriptionWidth=*` 와 함께 쓰일 때 화면에 표시됨

### 특수한 실수 및 표현 방식

- `AddDescription`은 `IndexOptions FancyIndexing`이 설정되어 있지 않으면 아무 효과가 없음
- 설명이 제대로 보이지 않을 경우, `NameWidth`와 `DescriptionWidth`가 충분히 넓게 지정되어야 함

## # DefaultType

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