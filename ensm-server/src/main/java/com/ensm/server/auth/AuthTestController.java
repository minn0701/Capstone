package com.ensm.server.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthTestController {

    @GetMapping("/auth/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("인증된 사용자입니다");
    }
}