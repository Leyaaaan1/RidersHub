package leyans.RidersHub.Config.Redis;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;
import java.time.Duration;

@Service
public class RateLimitService {
    @Autowired
    private ProxyManager<String> proxyManager;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final long MAPBOX_MONTHLY_LIMIT = 50_000;
    private final Map<String, Supplier<BucketConfiguration>> configurations = new ConcurrentHashMap<>();

    public RateLimitService() {
        // Default configuration for Wikimedia API (1 request per second)
        configurations.put("wikimedia_api", () ->
                BucketConfiguration.builder()
                        .addLimit(Bandwidth.simple(1, Duration.ofSeconds(1)))
                        .build());

        // Configuration for Nominatim API (1 request per second)
        configurations.put("nominatim_api", () ->
                BucketConfiguration.builder()
                        .addLimit(Bandwidth.simple(1, Duration.ofSeconds(1)))
                        .build());

        // Configuration for Mapbox API (1 request per second)
        configurations.put("mapbox_api", () ->
                BucketConfiguration.builder()
                        .addLimit(Bandwidth.simple(2, Duration.ofSeconds(1)))
                        .build());
    }


// this method it takes 3-5 minutes to complete
    public void waitForPermission(String key) throws InterruptedException {
        Bucket bucket = getBucket(key);
        bucket.asBlocking().consume(1);
    }

// and this  takes 6seconds to complete, but it is non-blocking which is good for performance but risky if the rate limit is exceeded
    public boolean freeApiAllowed(String key) {
        Bucket bucket = getBucket(key);
        return bucket.tryConsume(1);
    }
    public boolean isAllowed(String key) {
        Bucket bucket = getBucket(key);

        if ("mapbox_api".equals(key) && isMapboxLimitExceeded()) {
            return false;
        }

        boolean allowed = bucket.tryConsume(1);
        if (allowed && "mapbox_api".equals(key)) {
            incrementMapboxUsage();
        }

        return allowed;
    }

    //Secure maybe 5 seconds to complete, it has waiting period if it exceeds the rate limit
    public boolean isAllowedForThree(String key) {
        Bucket bucket = getBucket(key);

        if ("mapbox_api".equals(key)) {
            if (isMapboxLimitExceeded()) {
                return false;
            }
            boolean allowed = bucket.tryConsume(1);
            if (allowed) {
                incrementMapboxUsage();
            }
            return allowed;
        } else if ("nominatim_api".equals(key) || "wikimedia_api".equals(key)) {
            try {
                bucket.asBlocking().consume(1);
                return true;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return false;
            }
        } else {
            return bucket.tryConsume(1);
        }
    }



    private Bucket getBucket(String key) {
        Supplier<BucketConfiguration> config = configurations.getOrDefault(
                key,
                configurations.get("wikimedia_api") // Default fallback
        );
        return proxyManager.builder().build(key, config);
    }

    private void incrementMapboxUsage() {
        LocalDate now = LocalDate.now();
        LocalDate nextMonth = now.plusMonths(1).withDayOfMonth(1);
        long secondsUntilNextMonth = java.time.Duration.between(
                java.time.LocalDateTime.now(),
                nextMonth.atStartOfDay()
        ).getSeconds();

        String usageKey = "mapbox_usage:" + now.getYear() + "-" + now.getMonthValue();
        Long current = redisTemplate.opsForValue().increment(usageKey);
        if (current != null && current == 1L) {
            redisTemplate.expire(usageKey, Duration.ofSeconds(secondsUntilNextMonth));
        }
    }


    private boolean isMapboxLimitExceeded() {
        String usageKey = "mapbox_usage:" + LocalDate.now().getYear() + "-" + LocalDate.now().getMonthValue();
        Object value = redisTemplate.opsForValue().get(usageKey);
        Long current;
        if (value instanceof Integer) {
            current = ((Integer) value).longValue();
        } else if (value instanceof Long) {
            current = (Long) value;
        } else {
            current = 0L;
        }
        return current >= MAPBOX_MONTHLY_LIMIT;
    }

}