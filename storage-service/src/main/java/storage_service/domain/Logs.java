package storage_service.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import storage_service.domain.enums.levels;

import lombok.Data;

import java.util.Map;

@Data
@Document(collection = "logs")
public class Logs {

    @Id
    private String id;

    private float timestamp;
    private String message;
    private levels level;
    private String traceId;
    private String service;

    @JsonIgnore
    private String InstanceId;

    @JsonIgnore
    private String StackTrace;
    private Map<String, Object> metadata;

    private Boolean resolved;

}
