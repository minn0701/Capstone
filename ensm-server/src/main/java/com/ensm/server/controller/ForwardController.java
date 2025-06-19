package com.ensm.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ForwardController {

    @RequestMapping(value = { "/", "/find-account", "/change-password" })
    public String forwardToIndex(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri.equals("/logo192.png") || uri.equals("/manifest.json") || uri.equals("/favicon.ico")) {
            return null; // don't forward these static resources
        }
        return "forward:/index.html";
    }
}
