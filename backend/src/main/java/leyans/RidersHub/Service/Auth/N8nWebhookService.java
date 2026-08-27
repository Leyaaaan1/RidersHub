package leyans.RidersHub.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
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
    
    // Call this when user REGISTERS
    public void notifyNewRiderRegistration(String email) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("email", email);
            payload.put("event", "RIDER_REGISTERED");
            payload.put("timestamp", LocalDateTime.now().toString());
            
            logger.info("Sending registration notification to n8n for: {}", email);
            restTemplate.postForObject(n8nWebhookUrl, payload, String.class);
            logger.info("Registration notification sent successfully for: {}", email);
            
        } catch (RestClientException e) {
            logger.error("Failed to notify n8n about new registration for: {}", email, e);
        } catch (Exception e) {
            logger.error("Unexpected error while notifying n8n about registration", e);
        }
    }
    
    // Call this when user LOGS IN
    public void notifyRiderLogin(String email) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("email", email);
            payload.put("event", "RIDER_LOGIN");
            payload.put("timestamp", LocalDateTime.now().toString());
            
            logger.info("Sending login notification to n8n for: {}", email);
            restTemplate.postForObject(n8nWebhookUrl, payload, String.class);
            logger.info("Login notification sent successfully for: {}", email);
            
        } catch (RestClientException e) {
            logger.error("Failed to notify n8n about login for: {}", email, e);
        } catch (Exception e) {
            logger.error("Unexpected error while notifying n8n about login", e);
        }
    }
}