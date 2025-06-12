package alert_service.notifier;

import alert_service.domain.Logs;

public interface NotificationStrategy {

    public void Notify(Logs log) throws Exception;

}
