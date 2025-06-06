package log_ingestor_service.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class rootController {

    @GetMapping(path = "/")
    public String root() {
        return "Hello, welcome to logsy your log monitoring system for your SAAS product";
    }

}
