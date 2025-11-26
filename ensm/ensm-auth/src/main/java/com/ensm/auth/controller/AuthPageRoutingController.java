package com.ensm.auth.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * 인증 페이지 라우팅 컨트롤러
 * SPA(Single Page Application)를 위한 프론트엔드 라우팅 처리
 * 
 * /auth/* 경로의 모든 페이지 요청을 index.html로 라우팅하여
 * React Router가 클라이언트 사이드 라우팅을 처리하도록 합니다.
 * 
 * 방법 2: 파일 내용을 직접 읽어서 문자열로 반환
 */
@Controller
public class AuthPageRoutingController {

    @RequestMapping(value = { "/" }, method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<Void> redirectRoot() {
        // 루트 경로는 /auth/로 리다이렉트 (React Router의 basename="/auth"와 일치)
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(java.net.URI.create("/auth/"));
        return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
                .headers(headers)
                .build();
    }
    
    @RequestMapping(value = { "/auth/", "/auth/find-account", "/auth/change-password", "/auth/setup" }, method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<String> forwardToAuthPage() throws IOException {
        // index.html 파일 내용을 직접 읽어서 반환
        ClassPathResource resource = new ClassPathResource("static/index.html");
        
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

