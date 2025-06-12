package alert_service.domain;

import alert_service.domain.enums.Levels;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Logs {

    private float timestamp;

    private Levels level;

    private String message;

    private String service;

    private String instanceId;

    private Map<String, Object> metadata;

    private String traceId;

    private String stackTrace;

}
