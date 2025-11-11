package com.ensm.auth.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 인증 서비스
 * 사용자 로그인 및 비밀번호 변경 기능을 제공합니다.
 */
@Service
public class AuthService {
    private final UserStore userStore;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserStore userStore) {
        this.userStore = userStore;
    }

    /**
     * 사용자 로그인을 처리하고 JWT 토큰을 생성합니다.
     * 
     * @param username 사용자명
     * @param password 비밀번호
     * @return JWT 토큰
     * @throws RuntimeException 사용자명 또는 비밀번호가 유효하지 않은 경우
     */
    public String login(String username, String password) {
        User user = userStore.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Invalid user"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return JwtUtil.generateToken(username);
    }

    /**
     * 사용자 비밀번호를 변경합니다.
     * 
     * @param username 사용자명
     * @param currentPassword 현재 비밀번호
     * @param newPassword 새 비밀번호
     * @throws RuntimeException 사용자를 찾을 수 없거나 현재 비밀번호가 일치하지 않는 경우
     */
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userStore.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userStore.saveUserList();
    }
}
