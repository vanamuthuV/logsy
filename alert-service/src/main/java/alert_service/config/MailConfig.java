 package alert_service.config;
import alert_service.utils.RedisEnvService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
@RequiredArgsConstructor
public class MailConfig {

    private final RedisEnvService env;

    private volatile String fromEmail = null;

    public String getFromEmail() {
        return fromEmail;
    }

    @Bean
    public JavaMailSender javaMailSender() {
        String rawEmail = env.getString("dispatcher_email").orElse("");
        String rawPassword = env.getString("dispatcher_app_password").orElse("");

        // 🔥 sanitize values (remove wrapping quotes, trim spaces)
        String username = cleanValue(rawEmail);
        String appPassword = cleanValue(rawPassword);

        System.out.println("Email : " + username + "Password : " + appPassword);

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername(username);
        mailSender.setPassword(appPassword);
        mailSender.setDefaultEncoding("UTF-8");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        this.fromEmail = username;

        System.out.println("📧 Loaded sender from Redis: " + username);
        return mailSender;
    }

    private String cleanValue(String val) {
        if (val == null) return "";
        // remove outer quotes if they exist + trim spaces
        val = val.trim();
        if (val.startsWith("\"") && val.endsWith("\"")) {
            val = val.substring(1, val.length() - 1);
        }
        return val.trim();
    }

    @PostConstruct
    public void logLoadedMailUser() {
        System.out.println("✅ Mail sender loaded from Redis user: " + getFromEmail());
    }
}
