package com.ensm.main.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

public class JwtUtil {
    // 공유 JWT 시크릿 키 (auth와 main 서버에서 동일하게 사용)
    private static final String SECRET_KEY_STRING = "EnsmSecretKeyForJwtTokenGenerationAndValidation2024";
    private static final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));

    public static String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public static boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            System.out.println("Token expired");
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}

