//package leyans.RidersHub.Config.Redis;
//
//import io.github.bucket4j.Bandwidth;
//import io.github.bucket4j.Refill;
//import org.springframework.data.redis.core.convert.Bucket;
//import org.springframework.stereotype.Component;
//
//import java.time.Duration;
//import java.util.concurrent.ConcurrentHashMap;
//import java.util.concurrent.ConcurrentMap;
//
//@Component
//public class RateLimiterService {
//    // Map to store buckets per key (e.g. per IP or per API key)
//    private final ConcurrentMap<String, Bucket> cache = new ConcurrentHashMap<>();
//
//    // Configure your limits here - e.g., 10 calls per minute
//    private final Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
//
//    public Bucket resolveBucket(String key) {
//        return cache.computeIfAbsent(key, k -> Bucket.builder()
//                .addLimit(limit)
//                .build());
//    }
//
//    public boolean tryConsume(String key) {
//        Bucket bucket = resolveBucket(key);
//        return bucket.tryConsume(1);
//    }
//}
//
//
