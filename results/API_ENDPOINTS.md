# ENSM API 엔드포인트 목록

이 문서는 프론트엔드에서 호출하는 모든 API 엔드포인트를 정리한 것입니다.

## 기본 경로
- **메인 API**: `/main/api/*`
- **인증 API**: `/auth/*`

---

## 1. 시스템 설정

### GET /main/api/system-config
- **설명**: 시스템 설정 조회
- **요청**: 없음
- **응답**: 
  ```json
  {
    "systemName": "string",
    "darkMode": boolean,
    "ensmScriptsBasePath": "string",
    ...
  }
  ```

### PUT /main/api/system-config
- **설명**: 시스템 설정 업데이트
- **요청 Body**:
  ```json
  {
    "systemName": "string",
    "darkMode": boolean,
    ...
  }
  ```
- **응답**: 
  ```json
  {
    "message": "설정이 저장되었습니다."
  }
  ```

---

## 2. 사용자 관리 (인증 서버)

### GET /auth/users
- **설명**: 사용자 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    { "username": "admin" },
    { "username": "user1" }
  ]
  ```

### POST /auth/users
- **설명**: 사용자 추가
- **요청 Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "사용자가 추가되었습니다."
  }
  ```
- **에러 응답**:
  ```json
  {
    "error": "이미 존재하는 사용자명입니다."
  }
  ```

### DELETE /auth/users/{username}
- **설명**: 사용자 삭제
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "사용자가 삭제되었습니다."
  }
  ```

---

## 3. 패키지 설정

### GET /main/api/{package}-config/installed
- **설명**: 패키지 설치 여부 확인
- **패키지 ID**: `apache`, `bind`, `docker`, `git`, `jellyfin`, `plex`, `home-assistant`, `novnc`, `nfs`, `vsftpd`
- **요청**: 없음
- **응답**: 
  ```json
  {
    "installed": boolean
  }
  ```

### GET /main/api/{package}-config/current
- **설명**: 현재 패키지 설정 조회
- **요청**: 없음
- **응답**: 패키지별 설정 객체 (예: Apache의 경우 port, serverName, documentRoot 등)

### PUT /main/api/{package}-config
- **설명**: 패키지 설정 저장
- **요청 Body**: 패키지별 설정 객체
- **응답**: 
  ```json
  {
    "message": "설정이 저장되었습니다."
  }
  ```
- **에러 응답**:
  ```json
  {
    "error": "설정 저장에 실패했습니다."
  }
  ```

### POST /main/api/{package}-config/restart
- **설명**: 패키지 서비스 재시작
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "서비스가 재시작되었습니다."
  }
  ```

---

## 4. 패키지 관리

### GET /main/api/packages
- **설명**: 설치된 패키지 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "id": "apache",
      "name": "Apache HTTP Server",
      "installed": "true",
      "serviceStatus": "running",
      "autoStart": true
    },
    ...
  ]
  ```

### POST /main/api/packages/{id}/install
- **설명**: 패키지 설치
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "패키지가 설치되었습니다."
  }
  ```

### DELETE /main/api/packages/{id}
- **설명**: 패키지 제거
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "패키지가 제거되었습니다."
  }
  ```

### POST /main/api/packages/{id}/service/{action}
- **설명**: 서비스 제어 (start, stop, restart, reload)
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "서비스가 시작되었습니다."
  }
  ```

### POST /main/api/packages/{id}/autostart
- **설명**: 부팅 시 자동 시작 설정
- **요청 Body**:
  ```json
  {
    "enabled": boolean
  }
  ```
- **응답**: 
  ```json
  {
    "message": "자동 시작 설정이 변경되었습니다."
  }
  ```

---

## 5. CRON 관리

### GET /main/api/cron/{user}
- **설명**: 사용자별 CRON 작업 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "id": "0",
      "schedule": "0 0 * * * /usr/bin/backup.sh"
    },
    ...
  ]
  ```

### POST /main/api/cron/{user}
- **설명**: CRON 작업 추가
- **요청 Body**:
  ```json
  {
    "schedule": "0 0 * * *",
    "command": "/usr/bin/backup.sh"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "CRON 작업이 추가되었습니다."
  }
  ```

### DELETE /main/api/cron/{user}/{index}
- **설명**: CRON 작업 삭제
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "CRON 작업이 삭제되었습니다."
  }
  ```

---

## 6. 디스크 관리

### GET /main/api/disks/list
- **설명**: 디스크 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "device": "/dev/sda",
      "size": "500G",
      "model": "Samsung SSD 850",
      "interface": "SATA"
    },
    ...
  ]
  ```

### GET /main/api/disks/available
- **설명**: 사용 가능한 디스크 목록 조회 (파티션/LVM/RAID에 사용되지 않은 디스크)
- **요청**: 없음
- **응답**: 디스크 목록 배열 (형식은 `/disks/list`와 동일)

---

## 7. 파티션 관리

### GET /main/api/partitions/list
- **설명**: 파티션 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "device": "/dev/sda1",
      "disk": "/dev/sda",
      "size": "100G",
      "partitionType": "primary",
      "fileSystem": "ext4",
      "mountPoint": "/"
    },
    ...
  ]
  ```

### POST /main/api/partitions/create
- **설명**: 파티션 생성
- **요청 Body**:
  ```json
  {
    "disk": "/dev/sda",
    "size": "100",
    "sizeUnit": "G",
    "partitionType": "primary",
    "fileSystem": "ext4"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "파티션이 생성되었습니다."
  }
  ```

### DELETE /main/api/partitions/{device}
- **설명**: 파티션 삭제
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "파티션이 삭제되었습니다."
  }
  ```

### POST /main/api/partitions/format
- **설명**: 파티션 포맷
- **요청 Body**:
  ```json
  {
    "partition": "/dev/sda1",
    "fileSystem": "ext4",
    "label": "optional-label"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "파티션이 포맷되었습니다."
  }
  ```

### POST /main/api/partitions/mount
- **설명**: 파티션 마운트
- **요청 Body**:
  ```json
  {
    "partition": "/dev/sda1",
    "mountPoint": "/mnt/data"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "파티션이 마운트되었습니다."
  }
  ```

### POST /main/api/partitions/{device}/unmount
- **설명**: 파티션 언마운트
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "파티션이 언마운트되었습니다."
  }
  ```

---

## 8. RAID 관리

### GET /main/api/raid/list
- **설명**: RAID 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "name": "/dev/md0",
      "level": "1",
      "devices": ["/dev/sda", "/dev/sdb"],
      "spare": 0,
      "chunkSize": 512,
      "state": "active"
    },
    ...
  ]
  ```

### POST /main/api/raid/create
- **설명**: RAID 생성
- **요청 Body**:
  ```json
  {
    "name": "/dev/md0",
    "level": "1",
    "devices": ["/dev/sda", "/dev/sdb"],
    "spare": 0,
    "chunkSize": 512
  }
  ```
- **응답**: 
  ```json
  {
    "message": "RAID가 생성되었습니다."
  }
  ```

### DELETE /main/api/raid/{name}
- **설명**: RAID 삭제
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "RAID가 삭제되었습니다."
  }
  ```

---

## 9. LVM 관리

### GET /main/api/lvm/pv
- **설명**: 물리 볼륨(PV) 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "name": "/dev/sda",
      "device": "/dev/sda",
      "size": "100G",
      "vg": "vg0"
    },
    ...
  ]
  ```

### POST /main/api/lvm/pv/create
- **설명**: 물리 볼륨 생성
- **요청 Body**:
  ```json
  {
    "device": "/dev/sda"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "물리 볼륨이 생성되었습니다."
  }
  ```

### GET /main/api/lvm/vg
- **설명**: 볼륨 그룹(VG) 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "name": "vg0",
      "size": "200G",
      "used": "50G",
      "free": "150G",
      "pvCount": 2
    },
    ...
  ]
  ```

### POST /main/api/lvm/vg/create
- **설명**: 볼륨 그룹 생성
- **요청 Body**:
  ```json
  {
    "name": "vg0",
    "physicalVolumes": ["/dev/sda", "/dev/sdb"]
  }
  ```
- **응답**: 
  ```json
  {
    "message": "볼륨 그룹이 생성되었습니다."
  }
  ```

### POST /main/api/lvm/vg/expand
- **설명**: 볼륨 그룹 확장 (PV 추가)
- **요청 Body**:
  ```json
  {
    "volumeGroup": "vg0",
    "physicalVolumes": ["/dev/sdc"]
  }
  ```
- **응답**: 
  ```json
  {
    "message": "볼륨 그룹이 확장되었습니다."
  }
  ```

### GET /main/api/lvm/lv
- **설명**: 논리 볼륨(LV) 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "name": "lv0",
      "vg": "vg0",
      "size": "50G",
      "path": "/dev/vg0/lv0",
      "mountPoint": "/mnt/data"
    },
    ...
  ]
  ```

### POST /main/api/lvm/lv/create
- **설명**: 논리 볼륨 생성
- **요청 Body**:
  ```json
  {
    "name": "lv0",
    "volumeGroup": "vg0",
    "size": "50",
    "sizeUnit": "G",
    "mountPoint": "/mnt/data"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "논리 볼륨이 생성되었습니다."
  }
  ```

### POST /main/api/lvm/lv/expand
- **설명**: 논리 볼륨 확장
- **요청 Body**:
  ```json
  {
    "logicalVolume": "/dev/vg0/lv0",
    "size": "10",
    "sizeUnit": "G"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "논리 볼륨이 확장되었습니다."
  }
  ```

### POST /main/api/lvm/lv/shrink
- **설명**: 논리 볼륨 축소
- **요청 Body**:
  ```json
  {
    "logicalVolume": "/dev/vg0/lv0",
    "size": "10",
    "sizeUnit": "G"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "논리 볼륨이 축소되었습니다."
  }
  ```

---

## 10. 네트워크 관리

### GET /main/api/system-info/network
- **설명**: 네트워크 인터페이스 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "name": "eth0",
      "ip": "192.168.1.100"
    },
    ...
  ]
  ```

### GET /main/api/system-info/network-stats
- **설명**: 네트워크 통계 조회
- **요청**: 없음
- **응답**: 
  ```json
  {
    "interfaces": "네트워크 통계 정보",
    "connections": "연결 통계 정보",
    "routes": "라우팅 정보"
  }
  ```

### GET /main/api/system-info/network-log?type={type}&lines={lines}
- **설명**: 네트워크 로그 조회
- **쿼리 파라미터**:
  - `type`: 로그 타입 (예: "system", "network", "firewall")
  - `lines`: 조회할 라인 수
- **응답**: 
  ```json
  {
    "log": "로그 내용..."
  }
  ```

---

## 11. 포트 및 서비스 상태

### GET /main/api/system-info/ports
- **설명**: 열린 포트 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "netid": "tcp",
      "state": "LISTEN",
      "local": "0.0.0.0:80",
      "process": "apache"
    },
    ...
  ]
  ```

### GET /main/api/system-info/services
- **설명**: 서비스 상태 목록 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "name": "apache.service",
      "loaded": "loaded",
      "active": "active",
      "sub": "running"
    },
    ...
  ]
  ```

---

## 12. 디스크 및 RAID 상태

### GET /main/api/system-info/disk
- **설명**: 디스크 사용량 정보 조회
- **요청**: 없음
- **응답**: 
  ```json
  [
    {
      "filesystem": "/dev/sda1",
      "size": "100G",
      "used": "50G",
      "avail": "45G",
      "usePercent": "50%",
      "mounted": "/"
    },
    ...
  ]
  ```

### GET /main/api/system-info/raid
- **설명**: RAID 상태 정보 조회
- **요청**: 없음
- **응답**: RAID 상태 정보 (형식 미정)

---

## 13. DDNS 관리

### GET /main/api/ddns
- **설명**: DDNS 설정 조회
- **요청**: 없음
- **응답**: 
  ```json
  {
    "enabled": boolean,
    "apiToken": "string",
    "zoneName": "string",
    "recordName": "string",
    "ttl": 120,
    "schedule": "*/5 * * * *",
    "cronEnabled": boolean
  }
  ```

### PUT /main/api/ddns
- **설명**: DDNS 설정 업데이트
- **요청 Body**: DDNS 설정 객체 (GET 응답과 동일 형식)
- **응답**: 
  ```json
  {
    "message": "설정이 저장되었습니다."
  }
  ```

### POST /main/api/ddns/cron/toggle
- **설명**: DDNS 자동 업데이트 CRON 작업 토글
- **요청 Body**:
  ```json
  {
    "enable": boolean
  }
  ```
- **응답**: 
  ```json
  {
    "message": "DDNS 자동 업데이트가 활성화되었습니다."
  }
  ```

### POST /main/api/ddns/test
- **설명**: DDNS 설정 테스트
- **요청**: 없음
- **응답**: 
  ```json
  {
    "message": "DDNS 업데이트 테스트 성공"
  }
  ```

---

## 14. SSH 자동화

### POST /main/api/ssh/generate-key
- **설명**: SSH 키 생성
- **요청 Body**:
  ```json
  {
    "keyType": "rsa",
    "keySize": 2048,
    "comment": "optional-comment"
  }
  ```
- **응답**: 
  ```json
  {
    "message": "SSH 키가 생성되었습니다.",
    "publicKey": "ssh-rsa ..."
  }
  ```

### POST /main/api/ssh/copy-key
- **설명**: SSH 공개키 복사
- **요청 Body**:
  ```json
  {
    "host": "192.168.1.100",
    "user": "username",
    "password": "password",
    "publicKey": "ssh-rsa ..."
  }
  ```
- **응답**: 
  ```json
  {
    "message": "SSH 공개키가 복사되었습니다."
  }
  ```

---

## 15. 설명 문서

### GET /main/api/descriptions/{package}/{setting}
- **설명**: 설정 설명 문서 조회
- **요청**: 없음
- **응답**: Markdown 형식의 설명 문서 (텍스트)

---

## 공통 응답 형식

### 성공 응답
- **HTTP 상태 코드**: 200
- **응답 Body**: 
  ```json
  {
    "message": "작업이 완료되었습니다."
  }
  ```

### 에러 응답
- **HTTP 상태 코드**: 400, 404, 500 등
- **응답 Body**: 
  ```json
  {
    "error": "에러 메시지"
  }
  ```

---

## 인증

모든 API 요청은 쿠키 기반 인증을 사용합니다:
- `credentials: 'include'` 옵션으로 쿠키 자동 포함
- JWT 토큰이 쿠키에 저장되어 자동으로 전송됨

---

## 참고사항

1. **배열 응답**: 목록 조회 API는 항상 배열을 반환합니다. 빈 배열일 수 있습니다.
2. **에러 처리**: 모든 API는 에러 발생 시 적절한 HTTP 상태 코드와 에러 메시지를 반환합니다.
3. **데이터 동기화**: 디스크, 파티션, LVM, RAID 데이터는 서로 연동되어야 합니다.
4. **사용 가능한 디스크**: `/disks/available`은 다른 기능에서 사용 중인 디스크를 제외합니다.

---

**마지막 업데이트**: 2025-01-20
**버전**: 1.0

