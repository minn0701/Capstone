package com.ensm.server.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptGen {
    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("사용법: java BcryptGen <비밀번호>");
            return;
        }

        String password = args[0];
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);

        System.out.println("해시된 비밀번호: " + hash);
    }
}