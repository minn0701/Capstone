package com.ensm.main.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * 메인 애플리케이션 페이지 라우팅 컨트롤러
 * SPA(Single Page Application)를 위한 프론트엔드 라우팅 처리
 * 
 * 방법 2: 파일 내용을 직접 읽어서 문자열로 반환
 */
@Controller
public class MainPageRoutingController {

    @RequestMapping(value = {
        "/main",
        "/main/",
        "/main/index.html",
        "/main/dashboard",
        "/main/ensm/**",
        "/main/system/**",
        "/main/packages/**",
        "/main/network/**",
        "/main/tools/**"
    })
    public ResponseEntity<String> forwardToMainPage() throws IOException {
        // index.html 파일 내용을 직접 읽어서 반환
        ClassPathResource resource = new ClassPathResource("static/main/index.html");
        
        if (!resource.exists()) {
            System.err.println("경고: /main/index.html 파일을 찾을 수 없습니다.");
            // 대체 경로 시도
            resource = new ClassPathResource("static/index.html");
        }
        
        if (resource.exists()) {
            // 파일 내용을 문자열로 읽기
            String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(new MediaType(MediaType.TEXT_HTML, StandardCharsets.UTF_8));
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(content);
        }
        
        // index.html이 없으면 404
        return ResponseEntity.notFound().build();
    }
}