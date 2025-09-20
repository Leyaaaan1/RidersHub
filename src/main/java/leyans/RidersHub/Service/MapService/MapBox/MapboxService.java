package leyans.RidersHub.Service.MapService.MapBox;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.Util.RateLimitUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class MapboxService {
    private final String mapboxToken;
    private final MapImageService mapImageService;

    @Value("${mapbox.static-map.url-template}")
    private String mapboxUrlTemplate;

    @Autowired
    public MapboxService(@Value("${MAPBOX_TOKEN}") String mapboxToken,
                         MapImageService mapImageService) {
        this.mapboxToken = mapboxToken;
        this.mapImageService = mapImageService;
    }
    public String getStaticMapImageUrl(double lon, double lat) {
        String mapboxUrl = String.format(mapboxUrlTemplate,
                lon, lat, lon, lat, mapboxToken);

        return mapImageService.uploadMapImage(mapboxUrl);
    }





}