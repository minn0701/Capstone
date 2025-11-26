package com.ensm.main.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 MVC 설정
 * 정적 리소스 핸들러를 명시적으로 설정하여 /main/static/* 경로를 처리합니다.
 * @Order(1)로 설정하여 컨트롤러보다 우선순위를 높입니다.
 */
@Configuration
@Order(1)
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 정적 리소스 핸들러를 최우선으로 설정 (컨트롤러보다 먼저 매칭)
        // /main/static/** 경로를 classpath:/static/main/static/**로 매핑
        registry.addResourceHandler("/main/static/**")
                .addResourceLocations("classpath:/static/main/static/")
                .setCachePeriod(3600);
        
        // /main/favicon.ico, /main/manifest.json 등
        registry.addResourceHandler("/main/favicon.ico")
                .addResourceLocations("classpath:/static/main/favicon.ico")
                .setCachePeriod(3600);
        registry.addResourceHandler("/main/manifest.json")
                .addResourceLocations("classpath:/static/main/manifest.json")
                .setCachePeriod(3600);
        registry.addResourceHandler("/main/logo*.png")
                .addResourceLocations("classpath:/static/main/")
                .setCachePeriod(3600);
    }
}

