package alert_service.dispatcher;

import alert_service.domain.Logs;

public interface AlertDispatcherService {

    public void dispatch(Logs alert) throws Exception;

}
