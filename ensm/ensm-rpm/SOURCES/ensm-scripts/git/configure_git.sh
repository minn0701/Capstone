#!/bin/bash
# Git 설정 스크립트
# ENSM에서 Git 전역 설정을 관리하는 스크립트

# Git 사용자 이름 설정
set_user_name() {
    local name="$1"
    if [ -z "$name" ]; then
        echo "❌ 사용자 이름이 지정되지 않았습니다."
        exit 1
    fi
    git config --global user.name "$name"
    echo "✅ Git 사용자 이름이 ${name}으로 설정되었습니다."
}

# Git 사용자 이메일 설정
set_user_email() {
    local email="$1"
    if [ -z "$email" ]; then
        echo "❌ 사용자 이메일이 지정되지 않았습니다."
        exit 1
    fi
    git config --global user.email "$email"
    echo "✅ Git 사용자 이메일이 ${email}으로 설정되었습니다."
}

# 기본 브랜치 설정
set_default_branch() {
    local branch="$1"
    if [ -z "$branch" ]; then
        echo "❌ 기본 브랜치가 지정되지 않았습니다."
        exit 1
    fi
    git config --global init.defaultBranch "$branch"
    echo "✅ Git 기본 브랜치가 ${branch}으로 설정되었습니다."
}

# 에디터 설정
set_editor() {
    local editor="$1"
    if [ -z "$editor" ]; then
        echo "❌ 에디터가 지정되지 않았습니다."
        exit 1
    fi
    git config --global core.editor "$editor"
    echo "✅ Git 에디터가 ${editor}으로 설정되었습니다."
}

# Core autocrlf 설정
set_core_autocrlf() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ autocrlf 값이 지정되지 않았습니다."
        exit 1
    fi
    git config --global core.autocrlf "$value"
    echo "✅ Git core.autocrlf가 ${value}으로 설정되었습니다."
}

# Pull rebase 설정
set_pull_rebase() {
    local value="$1"
    local bool_value="false"
    if [ "$value" = "true" ] || [ "$value" = "1" ] || [ "$value" = "yes" ] || [ "$value" = "YES" ]; then
        bool_value="true"
    fi
    git config --global pull.rebase "$bool_value"
    echo "✅ Git pull.rebase가 ${bool_value}으로 설정되었습니다."
}

# Credential helper 설정
set_credential_helper() {
    local helper="$1"
    if [ -z "$helper" ]; then
        echo "❌ credential helper가 지정되지 않았습니다."
        exit 1
    fi
    git config --global credential.helper "$helper"
    echo "✅ Git credential.helper가 ${helper}으로 설정되었습니다."
}

# HTTP SSL verify 설정
set_http_ssl_verify() {
    local value="$1"
    local bool_value="true"
    if [ "$value" = "false" ] || [ "$value" = "0" ] || [ "$value" = "no" ] || [ "$value" = "NO" ]; then
        bool_value="false"
    fi
    git config --global http.sslVerify "$bool_value"
    echo "✅ Git http.sslVerify가 ${bool_value}으로 설정되었습니다."
}

# Push default 설정
set_push_default() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ push default 값이 지정되지 않았습니다."
        exit 1
    fi
    git config --global push.default "$value"
    echo "✅ Git push.default가 ${value}으로 설정되었습니다."
}

# 설정 적용 (Git은 설정 파일이므로 재시작 불필요)
apply() {
    echo "✅ Git 설정이 적용되었습니다."
}

# 모든 설정 읽기 (JSON 형식)
get_all() {
    echo "{"
    echo "  \"userName\": \"$(git config --global user.name || echo '')\","
    echo "  \"userEmail\": \"$(git config --global user.email || echo '')\","
    echo "  \"defaultBranch\": \"$(git config --global init.defaultBranch || echo 'main')\","
    echo "  \"initDefaultBranch\": \"$(git config --global init.defaultBranch || echo 'main')\","
    echo "  \"editor\": \"$(git config --global core.editor || echo 'vim')\","
    echo "  \"coreAutocrlf\": \"$(git config --global core.autocrlf || echo 'input')\","
    echo "  \"pullRebase\": $(git config --global --bool pull.rebase 2>/dev/null || echo 'false'),"
    echo "  \"credentialHelper\": \"$(git config --global credential.helper || echo 'store')\","
    echo "  \"httpSslVerify\": $(git config --global --bool http.sslVerify 2>/dev/null || echo 'true'),"
    echo "  \"pushDefault\": \"$(git config --global push.default || echo 'simple')\""
    echo "}"
}

# 메인 로직
case "$1" in
    set_user_name)
        set_user_name "$2"
        ;;
    set_user_email)
        set_user_email "$2"
        ;;
    set_default_branch)
        set_default_branch "$2"
        ;;
    set_editor)
        set_editor "$2"
        ;;
    set_core_autocrlf)
        set_core_autocrlf "$2"
        ;;
    set_pull_rebase)
        set_pull_rebase "$2"
        ;;
    set_credential_helper)
        set_credential_helper "$2"
        ;;
    set_http_ssl_verify)
        set_http_ssl_verify "$2"
        ;;
    set_push_default)
        set_push_default "$2"
        ;;
    apply)
        apply
        ;;
    get_all)
        get_all
        ;;
    *)
        echo "사용법: $0 {set_user_name|set_user_email|set_default_branch|set_editor|set_core_autocrlf|set_pull_rebase|set_credential_helper|set_http_ssl_verify|set_push_default|apply|get_all} [값]"
        exit 1
        ;;
esac

