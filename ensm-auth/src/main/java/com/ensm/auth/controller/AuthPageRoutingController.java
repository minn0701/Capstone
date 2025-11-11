package com.ensm.auth.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 인증 페이지 라우팅 컨트롤러
 * SPA(Single Page Application)를 위한 프론트엔드 라우팅 처리
 */
@Controller
public class AuthPageRoutingController {

    @RequestMapping(value = { "/", "/find-account", "/change-password" })
    public String forwardToAuthPage(HttpServletRequest request) {
        String uri = request.getRequestURI();
        // 정적 리소스는 Spring의 기본 정적 리소스 핸들러가 처리하도록 null 반환
        if (uri.equals("/logo192.png") || uri.equals("/manifest.json") || uri.equals("/favicon.ico")) {
            return null;
        }
        // 모든 인증 관련 페이지 요청을 index.html로 포워딩 (React Router가 처리)
        return "forward:/index.html";
    }
}
