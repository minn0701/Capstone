package ensm.server2.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Server2Controller {

    @GetMapping("/api/hello")
    public String test() {
        return "Hello, world!";
    }
}
