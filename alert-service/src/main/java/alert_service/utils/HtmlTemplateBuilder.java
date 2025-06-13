package alert_service.utils;

import alert_service.domain.Logs;
import org.springframework.stereotype.Component;

@Component
public class HtmlTemplateBuilder {

    public String buildHtml(Logs alert) {

        String levelColor = switch (alert.getLevel()) {
            case ERROR -> "#d9534f";
            case FATAL -> "#f0ad4e";
            default -> "#999999";
        };

        String html = """
<html>
  <body style='margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;'>
    <div style='max-width:600px;margin:30px auto;background:#fff;padding:24px;border-radius:12px;
                box-shadow:0 4px 10px rgba(0,0,0,0.07);'>
      
      <h2 style='color:%s;margin-top:0;'>🔔 %s Alert</h2>

      <table style='width:100%%;border-collapse:collapse;margin-top:16px;'>
        <tr>
          <td style='padding:8px 0;'><strong>📅 Time:</strong></td>
          <td style='padding:8px 0;'>%s</td>
        </tr>
        <tr>
          <td style='padding:8px 0;'><strong>🛠 Service:</strong></td>
          <td style='padding:8px 0;'>%s</td>
        </tr>
        <tr>
          <td style='padding:8px 0;'><strong>📌 Instance:</strong></td>
          <td style='padding:8px 0;'>%s</td>
        </tr>
        <tr>
          <td style='padding:8px 0;'><strong>🧾 Message:</strong></td>
          <td style='padding:8px 0;'>%s</td>
        </tr>
        %s
        %s
      </table>

      <p style='text-align:center;color:#999;font-size:12px;margin-top:24px;'>
        Log Monitoring System • Trace ID: %s
      </p>
    </div>
  </body>
</html>
""".formatted(
                levelColor,
                alert.getLevel(),                  // h2 header
                alert.getTimestamp(),              // Time
                alert.getService(),                // Service
                alert.getInstanceId(),             // Instance ID
                alert.getMessage(),                // Message

                // Metadata section if present
                (alert.getMetadata() != null && !alert.getMetadata().isEmpty()) ?
                        """
                        <tr>
                          <td style='padding:8px 0; vertical-align:top;'><strong>🧩 Metadata:</strong></td>
                          <td style='padding:8px 0;'><pre style='background:#f8f8f8;padding:10px;
                                border-radius:6px;font-size:13px;'>%s</pre></td>
                        </tr>
                        """.formatted(alert.getMetadata().toString()) : "",

                // Stack trace section if present
                (alert.getStackTrace() != null && !alert.getStackTrace().isBlank()) ?
                        """
                        <tr>
                          <td style='padding:8px 0; vertical-align:top;'><strong>💥 Stack Trace:</strong></td>
                          <td style='padding:8px 0;'><pre style='background:#fff5f5;color:#d9534f;
                                padding:10px;border-left:4px solid #d9534f;border-radius:6px;
                                font-size:13px;'>%s</pre></td>
                        </tr>
                        """.formatted(alert.getStackTrace()) : "",

                alert.getTraceId() != null ? alert.getTraceId() : "-"
        );

        return html;
    }
}
