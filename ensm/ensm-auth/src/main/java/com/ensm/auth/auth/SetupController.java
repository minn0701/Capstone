package com.ensm.auth.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 최초 설치 및 계정 등록 컨트롤러
 */
@RestController
@RequestMapping("/auth")
public class SetupController {
    private final UserStore userStore;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public SetupController(UserStore userStore) {
        this.userStore = userStore;
    }
    
    /**
     * 최초 설치 여부를 확인합니다.
     */
    @GetMapping("/setup/check")
    public ResponseEntity<Map<String, Boolean>> checkSetup() {
        boolean needsSetup = !userStore.hasUsers();
        return ResponseEntity.ok(Map.of("needsSetup", needsSetup));
    }
    
    /**
     * 최초 관리자 계정을 등록합니다.
     */
    @PostMapping("/setup")
    public ResponseEntity<Map<String, String>> setup(@RequestBody Map<String, String> request) {
        // 이미 사용자가 있으면 설정 불가
        if (userStore.hasUsers()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "이미 설정이 완료되었습니다."));
        }
        
        String username = request.get("username");
        String password = request.get("password");
        
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "사용자명을 입력해주세요."));
        }
        
        // root 계정명 사용 불가
        if ("root".equalsIgnoreCase(username.trim())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "root는 예약된 계정명입니다. 다른 사용자명을 사용해주세요."));
        }
        
        if (password == null || password.length() < 6) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "비밀번호는 6자 이상이어야 합니다."));
        }
        
        // 사용자 생성
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        
        userStore.addUser(user);
        
        return ResponseEntity.ok(Map.of("message", "관리자 계정이 생성되었습니다."));
    }
}

