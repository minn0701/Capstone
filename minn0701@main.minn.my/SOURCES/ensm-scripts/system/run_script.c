/*
 * run_script.c - 스크립트를 root 권한으로 실행하는 setuid wrapper
 * 
 * 사용법: run_script <script_path> [args...]
 * 
 * 이 프로그램은 setuid로 설정되어 있어서, 일반 사용자가 실행해도
 * root 권한으로 스크립트를 실행할 수 있습니다.
 * 
 * 보안: /usr/local/bin/ensm-scripts/ 하위의 스크립트만 실행 가능하도록 제한
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>

#define SCRIPT_BASE_PATH "/usr/local/bin/ensm-scripts"
#define MAX_PATH_LEN 1024

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "사용법: %s <script_path> [args...]\n", argv[0]);
        return 1;
    }

    char *script_path = argv[1];
    char full_path[MAX_PATH_LEN];
    
    // 절대 경로인 경우
    if (script_path[0] == '/') {
        // 보안: SCRIPT_BASE_PATH로 시작하는지 확인
        if (strncmp(script_path, SCRIPT_BASE_PATH, strlen(SCRIPT_BASE_PATH)) != 0) {
            fprintf(stderr, "오류: 허용되지 않은 경로입니다. %s 하위의 스크립트만 실행 가능합니다.\n", SCRIPT_BASE_PATH);
            return 1;
        }
        strncpy(full_path, script_path, MAX_PATH_LEN - 1);
        full_path[MAX_PATH_LEN - 1] = '\0';
    } else {
        // 상대 경로인 경우 SCRIPT_BASE_PATH 기준으로 절대 경로 생성
        snprintf(full_path, MAX_PATH_LEN, "%s/%s", SCRIPT_BASE_PATH, script_path);
    }

    // 파일 존재 확인
    struct stat st;
    if (stat(full_path, &st) != 0) {
        fprintf(stderr, "오류: 스크립트 파일을 찾을 수 없습니다: %s\n", full_path);
        return 1;
    }

    // 실행 가능한 파일인지 확인
    if (!S_ISREG(st.st_mode)) {
        fprintf(stderr, "오류: 일반 파일이 아닙니다: %s\n", full_path);
        return 1;
    }

    // execv를 사용하여 스크립트 실행
    // argv[1]부터가 스크립트 인자이므로, argv[1]을 full_path로 교체
    char **new_argv = (char **)malloc((argc + 1) * sizeof(char *));
    if (new_argv == NULL) {
        fprintf(stderr, "오류: 메모리 할당 실패\n");
        return 1;
    }

    // setuid가 작동하는지 확인: 실제 UID와 유효 UID를 root로 설정
    uid_t real_uid = getuid();
    uid_t eff_uid = geteuid();
    
    // 유효 UID가 root가 아니면 root로 설정 시도
    // setreuid를 사용하여 실제 UID와 유효 UID를 모두 root로 설정
    if (eff_uid != 0) {
        // setreuid(0, 0)을 사용하여 실제 UID와 유효 UID를 모두 root로 설정
        if (setreuid(0, 0) != 0) {
            fprintf(stderr, "오류: root 권한으로 전환할 수 없습니다.\n");
            fprintf(stderr, "  실제 UID: %d, 유효 UID: %d\n", real_uid, eff_uid);
            fprintf(stderr, "  가능한 원인:\n");
            fprintf(stderr, "    1. setuid 비트가 설정되지 않았거나 작동하지 않음\n");
            fprintf(stderr, "    2. SELinux가 setuid 실행을 차단함\n");
            fprintf(stderr, "    3. 파일 시스템이 nosuid 옵션으로 마운트됨\n");
            fprintf(stderr, "  해결 방법:\n");
            fprintf(stderr, "    - chmod 4755 /usr/local/bin/ensm-scripts/system/run_script\n");
            fprintf(stderr, "    - chcon -t unconfined_exec_t /usr/local/bin/ensm-scripts/system/run_script (SELinux)\n");
            free(new_argv);
            return 1;
        }
    } else {
        // 유효 UID가 이미 root인 경우, 실제 UID도 root로 설정
        if (real_uid != 0) {
            setreuid(0, 0);
        }
    }
    
    // 스크립트 경로를 full_path로 설정
    new_argv[0] = full_path;
    
    // 나머지 인자들 복사 (argv[2]부터)
    for (int i = 2; i < argc; i++) {
        new_argv[i - 1] = argv[i];
    }
    new_argv[argc - 1] = NULL;

    // 스크립트 실행
    execv(full_path, new_argv);
    
    // execv가 성공하면 여기 도달하지 않음
    perror("execv 실패");
    free(new_argv);
    return 1;
}

