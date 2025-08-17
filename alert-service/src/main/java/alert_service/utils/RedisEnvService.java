package alert_service.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import alert_service.domain.EmailSubscribers;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RedisEnvService {

    private final StringRedisTemplate redis;
    private final ObjectMapper mapper = new ObjectMapper();

    public Optional<String> getString(String key) {
        try {
            return Optional.ofNullable(redis.opsForValue().get(key));
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public List<EmailSubscribers> getEmailSubscribers(String key) {
        String raw = getString(key).orElse("[]");
        try {
            // First try parse directly as JSON array
            return mapper.readValue(raw, new TypeReference<>() {});
        } catch (Exception directFail) {
            try {
                // If value was double-encoded (like "\"[{\\"email\\":...}]\""), decode once then parse again
                String inner = mapper.readValue(raw, String.class);
                return mapper.readValue(inner, new TypeReference<>() {});
            } catch (Exception secondFail) {
                return List.of();
            }
        }
    }
}
