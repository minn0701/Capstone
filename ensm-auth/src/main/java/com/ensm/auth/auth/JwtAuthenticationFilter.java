package com.ensm.auth.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final UserStore userStore;

    public JwtAuthenticationFilter(UserStore userStore) {
        this.userStore = userStore;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username = JwtUtil.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            userStore.findByUsername(username).ifPresent(user -> {
                if (JwtUtil.isTokenValid(token, user.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    user.getAuthorities()
                            );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    // Set cookie after authentication
                    jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", token);
                    cookie.setHttpOnly(true);
                    cookie.setSecure(false); // Set to true in production
                    cookie.setPath("/");
                    cookie.setMaxAge(60 * 60); // 1시간
                    response.addCookie(cookie);
                    response.setHeader("Set-Cookie", String.format(
                        "token=%s; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax",
                        token
                    ));
                }
            });
        }

        filterChain.doFilter(request, response);
    }
}