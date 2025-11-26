package com.ensm.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 MVC 설정
 * 정적 리소스 핸들러를 명시적으로 설정하여 /auth/static/* 경로를 처리합니다.
 * @Order(1)로 설정하여 컨트롤러보다 우선순위를 높입니다.
 */
@Configuration
@Order(1)
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 정적 리소스 핸들러를 최우선으로 설정 (컨트롤러보다 먼저 매칭)
        // /auth/static/** 경로를 classpath:/static/static/**로 매핑
        registry.addResourceHandler("/auth/static/**")
                .addResourceLocations("classpath:/static/static/")
                .setCachePeriod(3600);
        
        // /auth/favicon.ico, /auth/manifest.json 등
        registry.addResourceHandler("/auth/favicon.ico")
                .addResourceLocations("classpath:/static/favicon.ico")
                .setCachePeriod(3600);
        registry.addResourceHandler("/auth/manifest.json")
                .addResourceLocations("classpath:/static/manifest.json")
                .setCachePeriod(3600);
        registry.addResourceHandler("/auth/logo*.png")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);
        
        // 루트 경로의 정적 리소스 (하위 호환성)
        registry.addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/static/favicon.ico")
                .setCachePeriod(3600);
        registry.addResourceHandler("/manifest.json")
                .addResourceLocations("classpath:/static/manifest.json")
                .setCachePeriod(3600);
    }
}

