package storage_service.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import storage_service.domain.Logs;
import storage_service.domain.enums.levels;
import storage_service.service.storageConsumer;
import storage_service.repository.logsRepository;

@Service
public class StorageConsumerImpl implements storageConsumer {

    @Autowired
    private logsRepository repository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @KafkaListener(
            topics = "${spring.kafka.consumer.topic}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String rawlogs) {

        try{
            Logs logs = objectMapper.readValue(rawlogs, Logs.class);
            
            if (logs.getLevel() == levels.ERROR || logs.getLevel() == levels.FATAL) {
                logs.setResolved(false);
            }

            repository.save(logs);

            System.out.println("Saved ✅");

        } catch(Exception e) {
            System.out.println("❌ error: " + e.getMessage());
        }

    }

}
