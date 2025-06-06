package log_ingestor_service.controllers;

import log_ingestor_service.domain.dto.LogsDto;
import log_ingestor_service.domain.enums.levels;
import log_ingestor_service.service.impl.kafkaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.Instant;

@Controller
public class logsController {

    @Autowired
    private kafkaServiceImpl logsService;

    @GetMapping(path = "/logs")
    public ResponseEntity<LogsDto> getLogs() {
        return new ResponseEntity<>(
                LogsDto.
                        builder().
                        level(levels.INFO).
                        message("Test for the get path").
                        timestamp(Instant.now()).
                        service("health-app").
                        build()

                , HttpStatus.OK);
    }

    @PostMapping(path = "/logs")
    public void postLogs(@RequestBody LogsDto logsDto) {
        logsService.sendMessage(logsDto);
    }

}
