package ensm.server2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardController {

//    @RequestMapping(value = { "/", "/{path:^(?!api$).*$}/**" })
//    public String forward() {
//        return "forward:/index.html";
//    }

    @Controller
    public class MainController {

        @RequestMapping(value = {"/main", "/main/{path:^(?!static|favicon\\.ico|manifest\\.json).*$}/**"})
        public String forwardMain() {
            return "forward:/index.html";
        }
    }
}
