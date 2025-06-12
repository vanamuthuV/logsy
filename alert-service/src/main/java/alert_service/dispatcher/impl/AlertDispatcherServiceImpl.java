package alert_service.dispatcher.impl;

import alert_service.dispatcher.AlertDispatcherService;
import alert_service.domain.Logs;
import alert_service.notifier.impl.EmailNotifier;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AlertDispatcherServiceImpl implements AlertDispatcherService {

    @Autowired
    private EmailNotifier emailNotifier;

    @Override
    public void dispatch(Logs alert) throws MessagingException {

       emailNotifier.Notify(alert);

    }

}
