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
            // Try to get a token from the bucket without blocking
            if (!rateLimitService.isAllowed(rateKey)) {
                // Only log when we actually hit a rate limit
                System.out.println("Rate limit reached for " + rateKey + ", waiting briefly...");
                // Wait a shorter time before retry
                Thread.sleep(100);
                // Try one more time before proceeding anyway
                rateLimitService.isAllowed(rateKey);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Rate limiting wait was interrupted: " + e.getMessage());
        }
    }}