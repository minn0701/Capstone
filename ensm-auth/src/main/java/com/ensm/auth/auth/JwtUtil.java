package com.ensm.auth.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

public class JwtUtil {
    // 공유 JWT 시크릿 키 (auth와 main 서버에서 동일하게 사용)
    private static final String SECRET_KEY_STRING = "EnsmSecretKeyForJwtTokenGenerationAndValidation2024";
    private static final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));
    private static final long EXPIRATION = 1000 * 60 * 60; // 1 hour

    public static String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .setId(UUID.randomUUID().toString())
            .signWith(key)
            .compact();
    }

    public static String extractUsername(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public static boolean isTokenValid(String token, String username) {
        try {
            String extractedUsername = extractUsername(token);
            return extractedUsername != null && extractedUsername.equals(username);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            System.out.println("Token expired");
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
