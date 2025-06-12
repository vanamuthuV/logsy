package alert_service.utils;

import alert_service.domain.Logs;
import org.springframework.stereotype.Component;

@Component
public class HtmlTemplateBuilder {

    public String buildHtml(Logs alert) {
        return "<html>" +
                "<body style='font-family:Arial,sans-serif'>" +
                "<h2 style='color:red;'>🔔 " + alert.getLevel() + " Alert</h2>" +
                "<p><strong>Message:</strong> " + alert.getMessage() + "</p>" +
                "<p><strong>Time:</strong> " + alert.getTimestamp() + "</p>" +
                "</body>" +
                "</html>";
    }
}
