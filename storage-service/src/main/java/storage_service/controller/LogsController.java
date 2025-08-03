package storage_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import storage_service.domain.Logs;
import storage_service.repository.logsRepository;

import java.util.List;

@RestController
public class LogsController {

    @Autowired
    private logsRepository db;

    @GetMapping(path = "/logs")
    public ResponseEntity<List<Logs>> getLogs() {

        List<Logs> logs = db.findAll();

        return ResponseEntity.ok(logs);
    }

}
