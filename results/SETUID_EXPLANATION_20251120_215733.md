# Setuid와 C Wrapper 필요성 설명

**생성일시**: 2025-11-20 21:57:33

## 핵심 질문

**"set-uid가 걸린 쉘을 자바 백엔드가 직접 호출하지는 못하는건가? 그래서 run-script.c가 필요한거야?"**

## 답변

### ❌ 쉘 스크립트에는 setuid가 작동하지 않습니다

**Linux/Unix 시스템에서**:
- 쉘 스크립트(.sh) 파일에 setuid 비트(4755)를 설정해도 **커널이 이를 무시합니다**
- 보안상의 이유로 스크립트 파일의 setuid는 작동하지 않음
- 따라서 스크립트를 root 권한으로 실행하려면 다른 방법이 필요

### ✅ 해결 방법: C Wrapper 사용

**C 바이너리 파일**:
- C로 컴파일된 바이너리 파일에는 setuid가 정상 작동
- `run_script.c`를 컴파일한 `run_script` 바이너리에 setuid 설정
- 이 바이너리가 스크립트를 root 권한으로 실행

## 구조

```
Java 백엔드 (ensm 사용자)
  ↓
run_script (C 바이너리, setuid 4755, root 소유)
  ↓ (root 권한으로 실행됨)
쉘 스크립트 (manage_packages.sh 등)
  ↓
실제 명령어 실행 (dnf install, systemctl enable 등, root 권한)
```

## 왜 C Wrapper가 필요한가?

1. **쉘 스크립트는 setuid 불가**: 보안상의 이유로 커널이 무시
2. **C 바이너리는 setuid 가능**: 정상 작동
3. **Java 백엔드가 직접 호출**: `run_script` 바이너리를 호출하면 root 권한으로 스크립트 실행

## 결론

**사용자의 이해가 정확합니다!**

- 쉘 스크립트에 setuid를 걸어도 작동하지 않음
- 따라서 C wrapper (`run_script.c`)가 필요
- Java 백엔드는 `run_script` 바이너리를 호출
- `run_script`가 setuid로 root 권한을 획득하고 스크립트를 실행

---

## 추가 질문: install_package.c와 enable_service.c는?

이 두 개도 같은 이유로 필요할 수 있습니다:
- 특정 명령어만 실행하는 전용 wrapper
- 하지만 `run_script.c`를 통해 스크립트로 처리할 수도 있음

**결정 필요**: 
- `run_script.c`만 생성 (모든 것을 스크립트로 처리)
- 또는 세 가지 모두 생성 (특정 명령어는 직접 wrapper 사용)

