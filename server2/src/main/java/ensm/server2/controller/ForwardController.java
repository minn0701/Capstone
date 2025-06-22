package ensm.server2.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardController {

    @RequestMapping(value = {"/main", "/main/{path:^(?!static|favicon\\\\.ico|manifest\\\\.json|descriptions).*$}/**"})
    public String forwardMain() {
        return "forward:/index.html";
    }
}