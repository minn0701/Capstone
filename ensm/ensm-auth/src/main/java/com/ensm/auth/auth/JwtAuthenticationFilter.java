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

        // 쿠키에서도 토큰 확인 (Authorization 헤더가 없을 때)
        String tokenValue = null;
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            tokenValue = authHeader.substring(7);
        } else if (request.getCookies() != null) {
            // 쿠키에서 토큰 추출
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    tokenValue = cookie.getValue();
                    break;
                }
            }
        }
        
        if (tokenValue == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 람다 표현식에서 사용하기 위해 final 변수로 복사
        final String token = tokenValue;
        String username = JwtUtil.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            userStore.findByUsername(username).ifPresent(user -> {
                if (JwtUtil.isTokenValid(token, user.getUsername())) {
                    // root 계정인지 확인 (파일에서 확인)
                    boolean isRoot = "root".equals(username);
                    
                    // root 계정이고 비밀번호 변경 페이지가 아니면 리다이렉트
                    String requestPath = request.getRequestURI();
                    String queryString = request.getQueryString();
                    String fullPath = queryString != null ? requestPath + "?" + queryString : requestPath;
                    
                    // GET 요청이고 root 계정이며, change-password 페이지가 아니면 리다이렉트
                    // 단, 이미 change-password 페이지에 있거나 정적 리소스는 제외
                    if (isRoot && "GET".equals(request.getMethod()) &&
                        !requestPath.equals("/auth/change-password") && 
                        !requestPath.startsWith("/change-password") && 
                        !requestPath.startsWith("/static") &&
                        !requestPath.startsWith("/auth/") &&
                        !requestPath.equals("/") &&
                        !requestPath.equals("/index.html") &&
                        !requestPath.equals("/favicon.ico") &&
                        !requestPath.equals("/manifest.json") &&
                        !requestPath.startsWith("/logo")) {
                        // 이미 리다이렉트된 경우 무한 루프 방지
                        if (!fullPath.contains("force=true")) {
                            try {
                                response.sendRedirect("/change-password?force=true");
                                return;
                            } catch (IOException e) {
                                // 리다이렉트 실패 시 계속 진행
                            }
                        }
                    }
                    
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

