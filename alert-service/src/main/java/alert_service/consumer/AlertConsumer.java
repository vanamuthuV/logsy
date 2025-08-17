package alert_service.consumer;

import alert_service.dispatcher.impl.AlertDispatcherServiceImpl;
import alert_service.domain.Logs;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class AlertConsumer {

    private final AlertDispatcherServiceImpl dispatch;

    private ObjectMapper objectMapper = new ObjectMapper();

//    @KafkaListener(
//            topics = "${spring.kafka.consumer.topic}",
//            groupId = "${spring.kafka.consumer.group-id}"
//    )
    @KafkaListener(
            topics = "alert-topic",
            groupId = "log-alert-group"
    )
    public void AlertReciver(String rawlogs) throws  Exception{
        try {
            Logs logs = objectMapper.readValue(rawlogs, Logs.class);
            System.out.println("📥 Received logs: " + logs);

            dispatch.dispatch(logs);

        } catch (Exception e) {
            System.err.println("❌ Failed to process alert: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
