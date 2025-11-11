# Rocky Linux 9.6 - 웹 인터페이스로 구현 가능한 서버 설정 기능 목록

## 현재 구현된 페이지 (9개)

### Packages (3개)
1. ✅ **ApacheConfig** - Apache 웹서버 설정 (구현됨)
2. ✅ **BindConfig** - BIND DNS 서버 설정 (구현됨)
3. ⚠️ **MailServerConfig** - 메일 서버 설정 (페이지만 존재, 미구현)

### System (2개)
4. ⚠️ **CronManagement** - CRON 작업 관리 (페이지만 존재, 미구현)
5. ⚠️ **DiskRaidStatus** - 디스크/RAID 상태 확인 (페이지만 존재, 미구현)

### Network (2개)
6. ⚠️ **NetworkLog** - 네트워크 상태 및 로그 확인 (페이지만 존재, 미구현)
7. ⚠️ **PortDaemonStatus** - 개방 포트 및 관련 Daemon 확인 (페이지만 존재, 미구현)

### Tools (2개)
8. ⚠️ **SSHAutomation** - SSH 자동화 (페이지만 존재, 미구현)
9. ⚠️ **WebFTP** - 웹 FTP (페이지만 존재, 미구현)

---

## 추가로 구현 가능한 기능 (Rocky Linux 9.6 기준)

### 🔥 높은 우선순위 (자주 사용되는 필수 기능)

#### 1. **Nginx 웹서버 설정** ⭐⭐⭐
- 설정 파일: `/etc/nginx/nginx.conf`, `/etc/nginx/conf.d/*.conf`
- 주요 기능: Virtual Host, SSL/TLS, 리버스 프록시, 로드 밸런싱
- 쉘 스크립트: `nginx -t` (설정 검증), `systemctl reload nginx`
- 구현 난이도: ⭐⭐ (Apache와 유사)

#### 2. **Firewalld 방화벽 관리** ⭐⭐⭐
- 설정 파일: `/etc/firewalld/`, `firewall-cmd` 명령어
- 주요 기능: 포트 열기/닫기, 서비스 허용, Zone 관리, 포트 포워딩
- 쉘 스크립트: `firewall-cmd --permanent --add-port=...`, `firewall-cmd --reload`
- 구현 난이도: ⭐⭐

#### 3. **SSH 서버 설정 (sshd)** ⭐⭐⭐
- 설정 파일: `/etc/ssh/sshd_config`
- 주요 기능: 포트 변경, 비밀번호 인증 on/off, Root 로그인 제어, 키 기반 인증
- 쉘 스크립트: `sshd -t` (설정 검증), `systemctl restart sshd`
- 구현 난이도: ⭐⭐

#### 4. **시스템 서비스 관리 (systemd)** ⭐⭐⭐
- 설정 파일: `/etc/systemd/system/`, `systemctl` 명령어
- 주요 기능: 서비스 시작/중지/재시작, 부팅 시 자동 시작 설정, 서비스 상태 확인
- 쉘 스크립트: `systemctl start/stop/restart/enable/disable [service]`
- 구현 난이도: ⭐

#### 5. **사용자 및 그룹 관리** ⭐⭐⭐
- 설정 파일: `/etc/passwd`, `/etc/group`, `/etc/shadow`
- 주요 기능: 사용자 추가/삭제/수정, 그룹 관리, 비밀번호 변경, sudo 권한 관리
- 쉘 스크립트: `useradd`, `userdel`, `usermod`, `passwd`, `groupadd`, `visudo`
- 구현 난이도: ⭐⭐

#### 6. **네트워크 인터페이스 설정 (NetworkManager)** ⭐⭐⭐
- 설정 파일: `/etc/sysconfig/network-scripts/ifcfg-*` 또는 `nmcli`
- 주요 기능: IP 주소, 게이트웨이, DNS 설정, 네트워크 인터페이스 활성화/비활성화
- 쉘 스크립트: `nmcli connection modify`, `nmcli connection up/down`
- 구현 난이도: ⭐⭐⭐

#### 7. **시간 동기화 (chronyd)** ⭐⭐
- 설정 파일: `/etc/chrony.conf`
- 주요 기능: NTP 서버 설정, 시간 동기화 상태 확인
- 쉘 스크립트: `chronyc sources`, `systemctl restart chronyd`
- 구현 난이도: ⭐

#### 8. **로그 관리 (rsyslog/journald)** ⭐⭐
- 설정 파일: `/etc/rsyslog.conf`, `/etc/systemd/journald.conf`
- 주요 기능: 로그 파일 위치 설정, 로그 로테이션, 로그 레벨 설정
- 쉘 스크립트: `journalctl`, `logrotate`
- 구현 난이도: ⭐⭐

### 📦 중간 우선순위 (유용한 기능)

#### 9. **Postfix 메일 서버 설정** ⭐⭐
- 설정 파일: `/etc/postfix/main.cf`
- 주요 기능: 도메인 설정, 릴레이 설정, 메일 큐 관리
- 쉘 스크립트: `postfix check`, `systemctl reload postfix`
- 구현 난이도: ⭐⭐⭐

#### 10. **Dovecot IMAP/POP3 설정** ⭐⭐
- 설정 파일: `/etc/dovecot/dovecot.conf`
- 주요 기능: 메일 박스 설정, 인증 설정
- 쉘 스크립트: `dovecot -n` (설정 검증), `systemctl restart dovecot`
- 구현 난이도: ⭐⭐⭐

#### 11. **SELinux 관리** ⭐⭐
- 설정 파일: `/etc/selinux/config`
- 주요 기능: SELinux 모드 변경 (Enforcing/Permissive/Disabled), 컨텍스트 관리
- 쉘 스크립트: `setenforce`, `getenforce`, `semanage`
- 구현 난이도: ⭐⭐⭐

#### 12. **디스크 파티션 관리** ⭐⭐
- 명령어: `fdisk`, `parted`, `lsblk`
- 주요 기능: 파티션 생성/삭제, 파일시스템 포맷, 마운트/언마운트
- 쉘 스크립트: `fdisk -l`, `mkfs`, `mount`, `umount`
- 구현 난이도: ⭐⭐⭐⭐ (주의 필요)

#### 13. **LVM (Logical Volume Manager) 관리** ⭐⭐
- 명령어: `pvcreate`, `vgcreate`, `lvcreate`, `lvextend`
- 주요 기능: 물리 볼륨, 볼륨 그룹, 논리 볼륨 관리
- 쉘 스크립트: `vgs`, `lvs`, `pvs`
- 구현 난이도: ⭐⭐⭐⭐

#### 14. **RAID 관리 (mdadm)** ⭐⭐
- 설정 파일: `/etc/mdadm.conf`
- 주요 기능: RAID 배열 생성/관리, 상태 모니터링
- 쉘 스크립트: `mdadm --create`, `mdadm --detail`, `cat /proc/mdstat`
- 구현 난이도: ⭐⭐⭐⭐

#### 15. **Samba 파일 공유 설정** ⭐⭐
- 설정 파일: `/etc/samba/smb.conf`
- 주요 기능: 공유 폴더 설정, 사용자 인증, 권한 관리
- 쉘 스크립트: `testparm`, `systemctl restart smb`
- 구현 난이도: ⭐⭐⭐

#### 16. **NFS (Network File System) 설정** ⭐⭐
- 설정 파일: `/etc/exports`
- 주요 기능: NFS 공유 설정, 마운트 포인트 관리
- 쉘 스크립트: `exportfs`, `systemctl restart nfs-server`
- 구현 난이도: ⭐⭐⭐

#### 17. **Squid 프록시 서버 설정** ⭐
- 설정 파일: `/etc/squid/squid.conf`
- 주요 기능: 프록시 포트 설정, 접근 제어, 캐시 설정
- 쉘 스크립트: `squid -k parse` (설정 검증), `systemctl restart squid`
- 구현 난이도: ⭐⭐⭐

#### 18. **Fail2ban 보안 설정** ⭐⭐
- 설정 파일: `/etc/fail2ban/jail.conf`, `/etc/fail2ban/jail.d/*.conf`
- 주요 기능: 침입 차단 규칙 설정, 로그 모니터링
- 쉘 스크립트: `fail2ban-client status`, `systemctl restart fail2ban`
- 구현 난이도: ⭐⭐⭐

#### 19. **시스템 모니터링 정보** ⭐⭐
- 명령어: `top`, `htop`, `free`, `df`, `iostat`, `netstat`, `ss`
- 주요 기능: CPU/메모리/디스크/네트워크 사용률 실시간 모니터링
- 쉘 스크립트: `cat /proc/meminfo`, `cat /proc/cpuinfo`, `df -h`
- 구현 난이도: ⭐⭐

#### 20. **패키지 관리 (dnf/yum)** ⭐⭐
- 명령어: `dnf`, `yum`, `rpm`
- 주요 기능: 패키지 설치/제거/업데이트, 저장소 관리
- 쉘 스크립트: `dnf install/remove/update`, `dnf repolist`
- 구현 난이도: ⭐⭐

### 🔧 낮은 우선순위 (특수 목적)

#### 21. **OpenVPN 서버 설정** ⭐
- 설정 파일: `/etc/openvpn/server/*.conf`
- 주요 기능: VPN 서버 설정, 클라이언트 인증서 관리
- 쉘 스크립트: `openvpn --config`, `systemctl restart openvpn@server`
- 구현 난이도: ⭐⭐⭐⭐

#### 22. **WireGuard VPN 설정** ⭐
- 설정 파일: `/etc/wireguard/wg0.conf`
- 주요 기능: VPN 터널 설정, 키 관리
- 쉘 스크립트: `wg-quick up/down`, `wg show`
- 구현 난이도: ⭐⭐⭐

#### 23. **백업 스케줄링** ⭐⭐
- 명령어: `tar`, `rsync`, `cron`
- 주요 기능: 자동 백업 설정, 백업 스케줄 관리
- 쉘 스크립트: `tar -czf`, `rsync -av`
- 구현 난이도: ⭐⭐

#### 24. **시스템 업데이트 관리** ⭐⭐
- 명령어: `dnf update`, `dnf upgrade`
- 주요 기능: 시스템 업데이트, 보안 패치 적용
- 쉘 스크립트: `dnf check-update`, `dnf update -y`
- 구현 난이도: ⭐⭐

---

## 구현 난이도 기준

- ⭐ : 매우 쉬움 (기본 명령어만 사용)
- ⭐⭐ : 쉬움 (설정 파일 수정 + 명령어 실행)
- ⭐⭐⭐ : 보통 (복잡한 설정 파일 파싱 필요)
- ⭐⭐⭐⭐ : 어려움 (주의 깊은 구현 필요, 데이터 손실 위험)

---

## 총 정리

### 현재 상태
- **구현 완료**: 2개 (Apache, BIND)
- **페이지만 존재**: 7개 (미구현)
- **총 페이지**: 9개

### 추가 구현 가능
- **높은 우선순위**: 8개
- **중간 우선순위**: 12개
- **낮은 우선순위**: 4개
- **총 추가 가능**: 24개

### 전체 구현 가능 기능
- **총 33개** (현재 9개 + 추가 24개)

---

## 추천 구현 순서

1. **Firewalld 방화벽 관리** - 보안 필수
2. **시스템 서비스 관리 (systemd)** - 기본 기능
3. **SSH 서버 설정** - 보안 필수
4. **사용자 및 그룹 관리** - 기본 기능
5. **네트워크 인터페이스 설정** - 기본 기능
6. **Nginx 웹서버 설정** - Apache와 유사하여 빠른 구현 가능
7. **시간 동기화 (chronyd)** - 간단함
8. **로그 관리** - 모니터링 필수
9. **시스템 모니터링 정보** - 실시간 상태 확인
10. **패키지 관리** - 시스템 관리 필수

