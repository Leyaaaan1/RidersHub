package leyans.RidersHub.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ErrorReportService {

    private static final Logger logger = LoggerFactory.getLogger(ErrorReportService.class);
    private final RestTemplate restTemplate;

    @Value("${n8n.error.webhook.url}")
    private String errorWebhookUrl;

    public ErrorReportService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void reportError(String errorMessage, String errorType, String endpoint, String stackTrace) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("error", errorMessage);
            payload.put("errorType", errorType);
            payload.put("endpoint", endpoint);
            payload.put("stackTrace", stackTrace);
            payload.put("timestamp", LocalDateTime.now().toString());

            logger.info("===== SENDING ERROR TO N8N =====");
            logger.info("Error: {} | Type: {} | Endpoint: {}", errorMessage, errorType, endpoint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            String response = restTemplate.postForObject(errorWebhookUrl, request, String.class);

            logger.info("✅ ERROR SENT TO N8N");

        } catch (Exception e) {
            logger.error("❌ FAILED TO SEND ERROR TO N8N: {}", e.getMessage());
        }
    }
}