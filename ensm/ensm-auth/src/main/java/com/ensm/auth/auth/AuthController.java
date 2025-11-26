package com.ensm.auth.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 인증 관련 API 컨트롤러
 * 로그인, 비밀번호 변경 등의 인증 기능을 제공합니다.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * 사용자 로그인을 처리하고 JWT 토큰을 발급합니다.
     * 
     * @param request 로그인 요청 정보 (username, password)
     * @param response HTTP 응답 객체 (쿠키 설정용)
     * @return 로그인 결과 및 리다이렉트 정보
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> request, jakarta.servlet.http.HttpServletResponse response) {
        String username = request.get("username");
        String password = request.get("password");
        
        // root 계정인지 확인 (파일에서 확인)
        if (authService.isRootAccount(username)) {
            // root 계정이면 비밀번호 변경 페이지로 리다이렉트
            // 임시 토큰 발급 (비밀번호 변경 전용)
            String tempToken = authService.login(username, password);
            
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", tempToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 10); // 10분 (비밀번호 변경용)
            response.addCookie(cookie);
            response.setHeader("Set-Cookie", String.format(
                "token=%s; Max-Age=600; Path=/; HttpOnly; SameSite=Lax",
                tempToken
            ));
            
            return ResponseEntity.ok(Map.of(
                "message", "비밀번호 변경 필요",
                "mustChangePassword", true,
                "redirect", "/auth/change-password?force=true"
            ));
        }
        
        // 일반 로그인 처리
        String token = authService.login(username, password);

        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 개발용으로 HTTPS 아님, 배포 시 true로 변경
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1시간
        // Domain은 명시하지 않음 (현재 도메인에 자동 설정됨)
        // SameSite=Lax는 Set-Cookie 헤더에 직접 설정
        response.addCookie(cookie);
        response.setHeader("Set-Cookie", String.format(
            "token=%s; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax",
            token
        ));

        // 로그인 성공 후 main 서버로 리다이렉트
        return ResponseEntity.ok(Map.of(
            "message", "로그인 성공",
            "redirect", "/main/dashboard"
        ));
    }
    /**
     * 현재 로그인한 사용자의 비밀번호를 변경합니다.
     * 
     * @param request 비밀번호 변경 요청 정보 (currentPassword, newPassword)
     * @param authentication 현재 인증된 사용자 정보
     * @return 비밀번호 변경 결과
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> updateUserPassword(
        @RequestBody Map<String, String> request,
        org.springframework.security.core.Authentication authentication
    ) {
        String username = authentication.getName();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        boolean force = Boolean.parseBoolean(request.getOrDefault("force", "false"));

        // 강제 변경 모드 (root 계정 초기 설정 - 계정명과 비밀번호 모두 변경)
        if (force && "root".equals(username)) {
            // root 계정이면 계정명과 비밀번호 모두 변경
            if (authService.isRootAccount(username)) {
                String newUsername = request.get("newUsername");
                
                // 새 계정명 검증
                if (newUsername == null || newUsername.trim().isEmpty()) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "새 계정명을 입력해주세요."));
                }
                
                // root 계정명 사용 불가
                if ("root".equalsIgnoreCase(newUsername.trim())) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "root는 예약된 계정명입니다. 다른 계정명을 사용해주세요."));
                }
                
                // 새 계정명이 이미 존재하는지 확인
                if (authService.getUserStore().findByUsername(newUsername.trim()).isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "이미 존재하는 계정명입니다."));
                }
                
                // 비밀번호 길이 확인
                if (newPassword == null || newPassword.length() < 6) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "비밀번호는 6자 이상이어야 합니다."));
                }
                
                // root 계정 삭제하고 새 계정 생성
                authService.replaceRootAccount(newUsername.trim(), newPassword);
                
                return ResponseEntity.ok(Map.of(
                    "message", "계정이 생성되었습니다. 새 계정으로 로그인해주세요.",
                    "redirect", "/auth/",
                    "newUsername", newUsername.trim()
                ));
            }
        }

        // 일반 비밀번호 변경
        authService.changePassword(username, currentPassword, newPassword);
        return ResponseEntity.ok(Map.of("message", "비밀번호가 변경되었습니다."));
    }
}

