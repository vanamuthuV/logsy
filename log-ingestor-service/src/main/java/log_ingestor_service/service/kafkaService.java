package log_ingestor_service.service;

import log_ingestor_service.domain.dto.LogsDto;

public interface kafkaService {
    public void sendMessage(LogsDto logsDto);
}
