package alert_service.domain;
import lombok.Data;

@Data
public class EmailSubscribers {

    private String id;
    private String name;
    private String email;
    private boolean active;

}