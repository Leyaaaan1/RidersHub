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
public class N8nWebhookService {
    
    private static final Logger logger = LoggerFactory.getLogger(N8nWebhookService.class);
    private final RestTemplate restTemplate;
    
    @Value("${n8n.webhook.url}")
    private String n8nWebhookUrl;

    public N8nWebhookService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    // NEW USER REGISTERED
    public void notifyNewRiderRegistration(String email) {
        sendWebhook(email, "RIDER_REGISTERED");
    }
    
    // USER LOGIN
    public void notifyRiderLogin(String email) {
        sendWebhook(email, "RIDER_LOGIN");
    }
    
    // COMMON METHOD
    private void sendWebhook(String email, String event) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("email", email);
            payload.put("event", event);
            payload.put("timestamp", LocalDateTime.now().toString());
            
            logger.info("===== SENDING TO N8N =====");
            logger.info("URL: {}", n8nWebhookUrl);
            logger.info("Event: {}, Email: {}", event, email);
            
            // Create request with JSON headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            
            String response = restTemplate.postForObject(n8nWebhookUrl, request, String.class);
            
            logger.info("✅ N8N RESPONSE: {}", response);
            logger.info("===== N8N CALL SUCCESS =====");
            
        } catch (Exception e) {
            logger.error("❌ N8N CALL FAILED for email: {} | Error: {}", email, e.getMessage());
            e.printStackTrace();
        }
    }
}