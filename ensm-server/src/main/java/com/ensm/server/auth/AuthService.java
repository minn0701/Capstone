package com.ensm.server.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserStore userStore;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserStore userStore) {
        this.userStore = userStore;
    }

    public String login(String username, String password) {
        User user = userStore.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Invalid user"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return JwtUtil.generateToken(username);
    }

    public void changePassword(String username, String current, String next) {
        User user = userStore.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(current, user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다");
        }

        user.setPassword(encoder.encode(next));
        userStore.saveUserList();
    }
}
