package com.ensm.auth.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 사용자 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/auth/users")
public class UserManagementController {
    private final UserStore userStore;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public UserManagementController(UserStore userStore) {
        this.userStore = userStore;
    }
    
    /**
     * 모든 사용자 목록을 조회합니다 (비밀번호 제외).
     */
    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getUsers() {
        List<Map<String, String>> users = userStore.getUsers().stream()
            .map(user -> Map.of("username", user.getUsername()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
    
    /**
     * 새 사용자를 추가합니다.
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> addUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "사용자명을 입력해주세요."));
        }
        
        if (password == null || password.length() < 6) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "비밀번호는 6자 이상이어야 합니다."));
        }
        
        // 이미 존재하는 사용자인지 확인
        if (userStore.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "이미 존재하는 사용자명입니다."));
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        
        userStore.addUser(user);
        
        return ResponseEntity.ok(Map.of("message", "사용자가 추가되었습니다."));
    }
    
    /**
     * 사용자를 삭제합니다.
     */
    @DeleteMapping("/{username}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String username) {
        User user = userStore.findByUsername(username)
            .orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "사용자를 찾을 수 없습니다."));
        }
        
        // 마지막 사용자는 삭제 불가
        if (userStore.getUsers().size() <= 1) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "마지막 사용자는 삭제할 수 없습니다."));
        }
        
        userStore.removeUser(username);
        
        return ResponseEntity.ok(Map.of("message", "사용자가 삭제되었습니다."));
    }
}

