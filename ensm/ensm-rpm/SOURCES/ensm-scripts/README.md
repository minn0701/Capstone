# ENSM Scripts

ENSM 시스템에서 사용하는 모든 쉘 스크립트를 포함합니다.

## 디렉토리 구조

```
ensm-scripts/
├── system/          # 시스템 관리 스크립트
├── network/         # 네트워크 관리 스크립트
├── apache/          # Apache 설정 스크립트
├── bind/            # BIND 설정 스크립트
└── tools/           # 유틸리티 스크립트
```

## 스크립트 목록

### 시스템 관리 (`system/`)

#### `manage_packages.sh`
패키지 설치/제거 및 서비스 제어

**사용법:**
```bash
./manage_packages.sh list                                    # 패키지 목록 조회 (JSON)
./manage_packages.sh install <package>                      # 패키지 설치
./manage_packages.sh remove <package>                       # 패키지 제거
./manage_packages.sh is_installed <package>                 # 설치 여부 확인
./manage_packages.sh service <package> <action>             # 서비스 제어 (start/stop/restart/reload)
./manage_packages.sh autostart <package> <true|false>       # 자동 시작 토글
```

**지원 패키지:**
- apache
- bind
- vsftpd
- nfs-utils
- docker
- git
- jellyfin
- plex
- home-assistant
- novnc

#### `manage_disks.sh`
디스크 목록 조회

**사용법:**
```bash
./manage_disks.sh list          # 디스크 목록 조회 (JSON)
./manage_disks.sh available     # 사용 가능한 디스크 목록 조회 (JSON)
```

#### `manage_partitions.sh`
파티션 생성/삭제/포맷/마운트/언마운트

**사용법:**
```bash
./manage_partitions.sh list                                    # 파티션 목록 조회 (JSON)
./manage_partitions.sh create <disk> <size> <unit> <type>     # 파티션 생성
./manage_partitions.sh delete <partition>                      # 파티션 삭제
./manage_partitions.sh format <partition> <fs> [label]         # 파티션 포맷
./manage_partitions.sh mount <partition> <mountpoint>          # 파티션 마운트
./manage_partitions.sh unmount <partition>                     # 파티션 언마운트
```

#### `manage_raid.sh`
RAID 배열 생성/삭제/조회

**사용법:**
```bash
./manage_raid.sh list                                          # RAID 목록 조회 (JSON)
./manage_raid.sh create <name> <level> <devices> [spare] [chunk]  # RAID 생성
./manage_raid.sh delete <name>                                 # RAID 삭제
```

#### `manage_lvm.sh`
LVM (PV/VG/LV) 관리

**사용법:**
```bash
./manage_lvm.sh pv_list                                        # 물리 볼륨 목록 조회 (JSON)
./manage_lvm.sh pv_create <device>                            # 물리 볼륨 생성
./manage_lvm.sh vg_list                                        # 볼륨 그룹 목록 조회 (JSON)
./manage_lvm.sh vg_create <vg_name> <pvs>                     # 볼륨 그룹 생성
./manage_lvm.sh vg_expand <vg_name> <pvs>                     # 볼륨 그룹 확장
./manage_lvm.sh lv_list                                        # 논리 볼륨 목록 조회 (JSON)
./manage_lvm.sh lv_create <lv_name> <vg_name> <size> <unit> [mountpoint]  # 논리 볼륨 생성
./manage_lvm.sh lv_expand <lv_path> <size> <unit>             # 논리 볼륨 확장
./manage_lvm.sh lv_shrink <lv_path> <size> <unit>             # 논리 볼륨 축소
```

#### `manage_cron.sh`
CRON 작업 관리

**사용법:**
```bash
./manage_cron.sh list_jobs <user>                             # CRON 작업 목록 조회
./manage_cron.sh add_job <user> <schedule> <command>          # CRON 작업 추가
./manage_cron.sh delete_job <user> <index>                    # CRON 작업 삭제
```

#### `system_info.sh`
시스템 정보 조회

**사용법:**
```bash
./system_info.sh get_disk_info            # 디스크 사용량 정보 (JSON)
./system_info.sh get_raid_status          # RAID 상태 정보 (JSON)
./system_info.sh get_network_interfaces   # 네트워크 인터페이스 정보 (JSON)
./system_info.sh get_open_ports           # 개방 포트 정보 (JSON)
./system_info.sh get_running_services     # 실행 중인 서비스 목록 (JSON)
```

### 네트워크 관리 (`network/`)

#### `ddns_cloudflare.sh`
Cloudflare DDNS 자동 업데이트

**설정 파일:** `/root/config/ddns-config.yml`
```yaml
apiToken: "your-api-token"
zoneName: "example.com"
recordName: "subdomain.example.com"
ttl: 120
```

**사용법:**
```bash
./ddns_cloudflare.sh    # DDNS 업데이트 실행
```

#### `network_log.sh`
네트워크 로그 조회

**사용법:**
```bash
./network_log.sh get_log <type> [lines]   # 네트워크 로그 조회 (type: messages, secure, network, dmesg)
./network_log.sh get_stats                # 네트워크 통계 정보 조회 (JSON)
```

#### `port_daemon_status.sh`
포트 및 데몬 상태 조회

**사용법:**
```bash
./port_daemon_status.sh get_ports         # 개방 포트 정보 조회 (JSON)
./port_daemon_status.sh get_services      # 실행 중인 서비스 목록 조회 (JSON)
```

### 패키지 설정

#### `apache/configure_apache.sh`
Apache 설정 파일 수정

**사용법:**
```bash
./configure_apache.sh set_port <port>                 # 포트 설정
./configure_apache.sh set_servername <name>           # 서버 이름 설정
./configure_apache.sh set_docroot <path>              # 문서 루트 설정
./configure_apache.sh set_user <user>                 # 사용자 설정
./configure_apache.sh set_group <group>               # 그룹 설정
./configure_apache.sh apply                           # 설정 적용 (검증 및 재시작)
```

#### `bind/configure_bind.sh`
BIND 설정 파일 수정

**사용법:**
```bash
./configure_bind.sh set_listen_on <value>             # listen-on 설정
./configure_bind.sh set_allow_query <value>           # allow-query 설정
./configure_bind.sh set_forwarders <value>            # forwarders 설정
./configure_bind.sh apply                             # 설정 적용 (검증 및 재시작)
```

### 유틸리티 (`tools/`)

#### `ssh_automation.sh`
SSH 키 생성 및 복사

**사용법:**
```bash
./ssh_automation.sh generate_key <key_type> [key_size] [comment]    # SSH 키 생성
./ssh_automation.sh copy_key <public_key_path> <user> <host> [port] # SSH 키 복사
```

## JSON 출력 형식

대부분의 스크립트는 JSON 형식으로 결과를 출력합니다. 이는 백엔드에서 파싱하기 쉽도록 하기 위함입니다.

**예시:**
```json
[
  {
    "device": "/dev/sda",
    "size": "500G",
    "model": "Samsung SSD 850",
    "interface": "SATA",
    "partitionCount": 2
  }
]
```

## 권한 설정

모든 스크립트는 실행 권한이 필요합니다:
```bash
chmod +x *.sh
```

일부 스크립트는 root 권한이 필요할 수 있습니다 (예: 디스크 관리, 패키지 설치).

## 의존성

- `jq`: JSON 파싱 (선택사항, 없어도 동작하지만 JSON 출력이 덜 정확할 수 있음)
- `lsblk`: 디스크 정보 조회
- `parted`: 파티션 관리
- `mdadm`: RAID 관리
- `lvm2`: LVM 관리
- `ss`: 네트워크 포트 조회
- `systemctl`: 서비스 관리
- `ip`: 네트워크 인터페이스 관리

## 설치

Rocky Linux 9.6에서 필요한 패키지 설치:
```bash
dnf install -y jq util-linux parted mdadm lvm2 iproute systemd
```

