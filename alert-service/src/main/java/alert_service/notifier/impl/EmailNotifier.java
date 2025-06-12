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

@Component("email")
@RequiredArgsConstructor
public class EmailNotifier implements NotificationStrategy {

    private final JavaMailSender mailSender;

    private final HtmlTemplateBuilder htmlTemplateBuilder;

    @Value("${spring.environments.email}")
    private String email;

    @Override
    public void Notify(Logs alert) throws MessagingException {

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setTo(email);
        helper.setSubject(alert.getLevel() + ": From " + alert.getService() + " Service");
        helper.setText(htmlTemplateBuilder.buildHtml(alert), true);

        mailSender.send(mimeMessage);
        System.out.println("📬 Email sent to: " + email);
    }
}
