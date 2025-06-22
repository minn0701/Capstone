package com.ensm.server.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, jakarta.servlet.http.HttpServletResponse response) {
        String token = authService.login(request.get("username"), request.get("password"));

        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 개발용으로 HTTPS 아님, 배포 시 true로 변경
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1시간
        cookie.setDomain("ensm.duckdns.org"); // 도메인 필요 시 명시

        response.addCookie(cookie);
        response.setHeader("Set-Cookie", String.format(
            "token=%s; Max-Age=3600; Path=/; Domain=ensm.duckdns.org; HttpOnly; Secure; SameSite=Strict",
            token
        ));

        return ResponseEntity.ok(Map.of("message", "로그인 성공"));
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
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
