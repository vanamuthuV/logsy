package log_ingestor_service.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import log_ingestor_service.domain.enums.levels;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LogsDto {

    @NotNull
    private Instant timestamp;

    @NotNull
    private levels level;

    @NotBlank
    private String message;

    @NotBlank
    private String service;

    private String instanceId;

    private Map<String, Object> metadata;

    private String traceId;

    private String stackTrace;

}