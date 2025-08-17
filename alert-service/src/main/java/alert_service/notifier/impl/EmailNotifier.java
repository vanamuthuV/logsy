package alert_service.notifier.impl;

import alert_service.domain.Logs;
import alert_service.notifier.NotificationStrategy;
import alert_service.utils.HtmlTemplateBuilder;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import alert_service.config.MailConfig;
import alert_service.utils.RedisEnvService;
import alert_service.domain.EmailSubscribers;

import java.util.Arrays;
import java.util.List;

@Component("email")
@RequiredArgsConstructor
public class EmailNotifier implements NotificationStrategy {

    private final JavaMailSender mailSender;
    private final HtmlTemplateBuilder htmlTemplateBuilder;
    private final RedisEnvService env;
    private final MailConfig mailConfig;

    @Override
    public void Notify(Logs alert) throws MessagingException {

        List<EmailSubscribers> subs = env.getEmailSubscribers("email_subscribers");
        String[] toList = subs.stream()
                .filter(EmailSubscribers::isActive)
                .map(EmailSubscribers::getEmail)
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .toArray(String[]::new);

        if (toList.length == 0) {
            System.out.println("⚠️ No active email subscribers found in Redis (key: email_subscribers). Skipping email send.");
            return;
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        String from = mailConfig.getFromEmail();
        if (from != null && !from.isBlank()) {
            helper.setFrom(from);
        }

        System.out.println("Users to be mailed :" + Arrays.toString(toList));

        helper.setTo(toList);
        helper.setSubject(alert.getLevel() + ": From " + alert.getService() + " Service");
        helper.setText(htmlTemplateBuilder.buildHtml(alert), true);

        mailSender.send(mimeMessage);
        System.out.println("📬 Email sent to subscribers: " + String.join(", ", toList));
    }
}
