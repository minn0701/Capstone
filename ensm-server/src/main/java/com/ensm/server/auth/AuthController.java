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
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String token = authService.login(request.get("username"), request.get("password"));
        return ResponseEntity.ok(Map.of("token", token));
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
