package leyans.RidersHub.Service.MapService.MapBox;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class MapboxService {
    private final String mapboxToken;
    private final MapImageService mapImageService;
    private final Bucket bucket;

    @Autowired
    public MapboxService(@Value("${MAPBOX_TOKEN}") String mapboxToken,
                         MapImageService mapImageService) {
        this.mapboxToken = mapboxToken;
        this.mapImageService = mapImageService;

        Bandwidth limit = Bandwidth.classic(50, Refill.greedy(50, Duration.ofMinutes(1)));
        this.bucket = Bucket.builder().addLimit(limit).build();
    }

    private void enforceRateLimit() {
        try {
            bucket.asBlocking().consume(1);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Rate limiting wait was interrupted: " + e.getMessage());
        }
    }

    public String getStaticMapImageUrl(double lon, double lat) {
        enforceRateLimit();
        String mapboxUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+ff0000("
                + lon + "," + lat + ")/" + lon + "," + lat
                + ",14/600x300?access_token=" + mapboxToken;

        return mapImageService.uploadMapImage(mapboxUrl);
    }
}