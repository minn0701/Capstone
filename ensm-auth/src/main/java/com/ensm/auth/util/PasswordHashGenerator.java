package com.ensm.auth.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 비밀번호 해시 생성 유틸리티
 * 사용자 비밀번호를 BCrypt로 해시화하는 도구
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("사용법: java PasswordHashGenerator <비밀번호>");
            return;
        }

        String password = args[0];
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);

        System.out.println("해시된 비밀번호: " + hash);
    }
}