package leyans.RidersHub.Service.Util;


import leyans.RidersHub.Config.Redis.RateLimitService;
import org.springframework.stereotype.Component;

@Component
public class RateLimitUtil {

    private final RateLimitService rateLimitService;

    public RateLimitUtil(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    public void enforceRateLimit(String rateKey) {
        try {
            System.out.println("Waiting for " + rateKey + " rate limit...");
            while (!rateLimitService.isAllowed(rateKey)) {
                Thread.sleep(1000);
            }
            System.out.println("Rate limit consumed, proceeding with request.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Rate limiting wait was interrupted: " + e.getMessage());
        }
    }
}