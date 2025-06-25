package leyans.RidersHub.Service.MapService.MapBox;

import leyans.RidersHub.Util.RateLimitUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

@Component
public class MapboxService {
    private final String mapboxToken;
    private final leyans.RidersHub.Service.MapService.MapBox.MapImageService mapImageService;

    private final RateLimitUtil rateLimitUtil;

    private static final String RATE_LIMIT_KEY = "mapbox_api";
    @Value("${mapbox.static-map.url-template}")
    private String mapboxUrlTemplate;

    @Autowired
    public MapboxService(@Value("${MAPBOX_TOKEN}") String mapboxToken,
                         leyans.RidersHub.Service.MapService.MapBox.MapImageService mapImageService, RateLimitUtil rateLimitUtil) {
        this.mapboxToken = mapboxToken;
        this.mapImageService = mapImageService;
        this.rateLimitUtil = rateLimitUtil;
    }
    @Cacheable(value = "mapbox", key = "'static_map_' + #lon + '_' + #lat")
    public String getStaticMapImageUrl(double lon, double lat) {
        rateLimitUtil.enforceRateLimitMapBox(RATE_LIMIT_KEY);



        String mapboxUrl = String.format(mapboxUrlTemplate,
                lon, lat, lon, lat, mapboxToken);

        return mapImageService.uploadMapImage(mapboxUrl);
    }


    public String checkCachedMapImage(double lon, double lat) {
        return getCachedMapImage(lon, lat);
    }

    @Cacheable(value = "mapbox", key = "'static_map_' + #lon + '_' + #lat", condition = "false")
    public String getCachedMapImage(double lon, double lat) {
        return null;
    }
}