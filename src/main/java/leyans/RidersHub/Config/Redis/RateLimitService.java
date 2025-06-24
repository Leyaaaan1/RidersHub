package leyans.RidersHub.Config.Redis;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;
import java.time.Duration;

@Service
public class RateLimitService {
    @Autowired
    private ProxyManager<String> proxyManager;

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

        // Configuration for Mapbox API (50 requests per minute)
        configurations.put("mapbox_api", () ->
                BucketConfiguration.builder()
                        .addLimit(Bandwidth.simple(1, Duration.ofMinutes(1)))
                        .build());
    }

    public boolean isAllowed(String key) {
        Bucket bucket = getBucket(key);
        return bucket.tryConsume(1);
    }

    public long getAvailableTokens(String key) {
        Bucket bucket = getBucket(key);
        return bucket.getAvailableTokens();
    }

    private Bucket getBucket(String key) {
        Supplier<BucketConfiguration> config = configurations.getOrDefault(
                key,
                configurations.get("wikimedia_api") // Default fallback
        );
        return proxyManager.builder().build(key, config);
    }
}