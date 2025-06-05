package log_ingestor_service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class logsController {

    @GetMapping(path = "/logs")
    public ResponseEntity<String> getLogs() {
        return new ResponseEntity<>("This is where the logs will be dipatched", HttpStatus.OK);
    }

}
