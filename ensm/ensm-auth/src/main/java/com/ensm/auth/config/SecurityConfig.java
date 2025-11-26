package com.ensm.auth.config;

import com.ensm.auth.auth.JwtAuthenticationFilter;
import com.ensm.auth.auth.UserStore;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserStore userStore;

    public SecurityConfig(UserStore userStore) {
        this.userStore = userStore;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/index.html", "/auth/", "/auth/index.html", "/auth/static/**", "/static/**", "/auth/login", "/auth/setup/**", "/auth/change-password", "/auth/change-password/**", "/auth/find-account", "/auth/find-account/**", "/favicon.ico", "/manifest.json", "/auth/favicon.ico", "/auth/manifest.json").permitAll()
                .requestMatchers("/auth/users/**").authenticated()
                .requestMatchers("/auth/change-password").authenticated() // POST 요청은 인증 필요
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthenticationFilter(userStore), UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(e -> e
                .authenticationEntryPoint((request, response, authException) -> response.sendRedirect("/auth/"))
            )
            .httpBasic(b -> b.disable())
            .formLogin(f -> f.disable());
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

