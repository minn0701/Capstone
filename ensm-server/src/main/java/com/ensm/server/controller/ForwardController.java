package com.ensm.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardController {

    @RequestMapping(value = { "/", "/find-account", "/change-password" })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
