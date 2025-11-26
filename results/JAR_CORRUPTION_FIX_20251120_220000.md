# JAR 파일 손상 문제 해결

**생성일시**: 2025-11-20 22:00:00

## 문제 분석

리눅스 서버에서 `ensm-main.jar` 실행 시 `NegativeArraySizeException: -12167` 오류가 발생합니다. 이는 JAR 파일 내부의 중첩된 JAR 파일이 손상되었음을 의미합니다.

### 원인

1. **이전 빌드 폴더 재사용**: `buildReact` 태스크의 `onlyIf` 조건으로 인해 이전 빌드 폴더가 있으면 React 빌드를 건너뛰고, 손상된 파일이 JAR에 포함될 수 있습니다.
2. **불완전한 clean**: 빌드 전에 완전한 clean이 수행되지 않아 이전 빌드 산출물이 남아있을 수 있습니다.

## 해결 방법

### 1. 빌드 폴더 자동 삭제

`ensm-main/build.gradle`과 `ensm-auth/build.gradle`에서:
- `cleanNodeModules` 태스크에 `build` 폴더 삭제 추가
- `buildReact` 태스크의 `onlyIf` 조건 제거 (항상 빌드 실행)

### 2. 완전한 clean 보장

`ensm/build.gradle`에서:
- `buildAll` 태스크가 `clean`을 먼저 실행하도록 수정
- 빌드 전에 모든 이전 빌드 산출물 삭제

## 적용된 변경사항

### `ensm/ensm-main/build.gradle`
```groovy
task cleanNodeModules(type: Delete) {
    delete "$frontendDir/node_modules"
    delete "$frontendDir/package-lock.json"
    // 이전 빌드 폴더도 삭제하여 손상된 파일 방지
    delete "$frontendDir/build"
}

task buildReact(type: Exec) {
    // ...
    // onlyIf 조건 제거 - 항상 빌드 실행
}
```

### `ensm/ensm-auth/build.gradle`
동일한 변경사항 적용

### `ensm/build.gradle`
```groovy
task buildAll {
    dependsOn ':ensm-auth:clean'
    dependsOn ':ensm-main:clean'
    dependsOn ':ensm-auth:build'
    dependsOn ':ensm-main:build'
}
```

## 다음 단계

1. **완전한 재빌드**:
   ```bash
   cd ensm
   .\build-for-rpm.bat
   ```

2. **리눅스 서버에 재배포**:
   ```bash
   cd ensm-rpm
   ./build-and-deploy.sh
   ```

3. **서비스 재시작**:
   ```bash
   sudo systemctl restart ensm-main.service
   sudo systemctl status ensm-main.service
   ```

## 예상 결과

- React 빌드가 항상 새로 수행되어 손상된 파일이 포함되지 않음
- 완전한 clean으로 이전 빌드 산출물이 남지 않음
- 정상적인 JAR 파일 생성 및 실행

