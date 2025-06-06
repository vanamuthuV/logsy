package log_ingestor_service.service.impl;

import log_ingestor_service.domain.dto.LogsDto;
import log_ingestor_service.service.kafkaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class kafkaServiceImpl implements kafkaService {

    @Autowired
    private KafkaTemplate<String, LogsDto> kafkaTemplate;

    private final String topic = "log-service";

    @Override
    public void sendMessage(LogsDto logsDto) {

        kafkaTemplate.send(topic, logsDto);

    }

}
