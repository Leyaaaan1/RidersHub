package leyans.RidersHub.Service.MapService.MapBox;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import leyans.RidersHub.Config.Redis.RateLimitService;
import leyans.RidersHub.Service.Util.RateLimitUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class MapboxService {
    private final String mapboxToken;
    private final leyans.RidersHub.Service.MapService.MapBox.MapImageService mapImageService;

    private final RateLimitUtil rateLimitUtil;

    private static final String RATE_LIMIT_KEY = "mapbox_api";


    @Autowired
    public MapboxService(@Value("${MAPBOX_TOKEN}") String mapboxToken,
                         leyans.RidersHub.Service.MapService.MapBox.MapImageService mapImageService, RateLimitUtil rateLimitUtil) {
        this.mapboxToken = mapboxToken;
        this.mapImageService = mapImageService;
        this.rateLimitUtil = rateLimitUtil;
    }


    public String getStaticMapImageUrl(double lon, double lat) {
        rateLimitUtil.enforceRateLimit(RATE_LIMIT_KEY);
        String mapboxUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+ff0000("
                + lon + "," + lat + ")/" + lon + "," + lat
                + ",14/600x300?access_token=" + mapboxToken;

        return mapImageService.uploadMapImage(mapboxUrl);
    }
}