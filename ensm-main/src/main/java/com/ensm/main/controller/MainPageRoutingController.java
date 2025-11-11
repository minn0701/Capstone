package com.ensm.main.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

/**
 * 메인 애플리케이션 페이지 라우팅 컨트롤러
 * SPA(Single Page Application)를 위한 프론트엔드 라우팅 처리
 */
@Controller
public class MainPageRoutingController {

    @RequestMapping(value = {
        "/main",
        "/main/dashboard",
        "/main/ensm/**",
        "/main/system/**",
        "/main/packages/**",
        "/main/network/**",
        "/main/tools/**"
    })
    public ResponseEntity<Resource> forwardToMainPage() {
        try {
            // 메인 애플리케이션의 모든 페이지 요청을 index.html로 포워딩 (React Router가 처리)
            // 정적 리소스를 직접 반환하여 무한 루프 방지
            Resource resource = new ClassPathResource("static/main/index.html");
            if (!resource.exists()) {
                System.err.println("경고: /main/index.html 파일을 찾을 수 없습니다.");
                // 대체 경로 시도
                resource = new ClassPathResource("static/index.html");
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(resource);
        } catch (Exception e) {
            System.err.println("리소스 로드 실패: " + e.getMessage());
            e.printStackTrace();
            // 에러 발생 시 404 반환
            return ResponseEntity.notFound().build();
        }
    }
}