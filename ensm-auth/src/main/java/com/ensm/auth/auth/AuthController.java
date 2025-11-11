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
        String token = authService.login(request.get("username"), request.get("password"));

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

        authService.changePassword(username, currentPassword, newPassword);
        return ResponseEntity.ok(Map.of("message", "비밀번호가 변경되었습니다."));
    }
}
