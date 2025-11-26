package com.ensm.main.config;

import com.ensm.main.auth.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/main/static/**", "/main/favicon.ico", "/main/manifest.json", "/main/descriptions/**", "/main/index.html", "/main", "/main/", "/main/dashboard", "/main/ensm/**", "/main/system/**", "/main/packages/**", "/main/network/**", "/main/tools/**").permitAll()
                        .requestMatchers("/main/api/system-config/**").authenticated()
                        .requestMatchers("/main/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                        .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            // JWT 토큰이 없거나 유효하지 않을 경우 auth 서버로 리다이렉트
                            // Caddy를 통해 접속하므로 상대 경로 사용
                            String redirectUrl = "/auth";
                            if (request.getRequestURI().startsWith("/main")) {
                                redirectUrl = "/auth?redirect=/main/dashboard";
                            }
                            response.sendRedirect(redirectUrl);
                        })
                )
                .httpBasic(b -> b.disable())
                .formLogin(f -> f.disable());

        return http.build();
    }
}