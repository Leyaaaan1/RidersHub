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


    @Cacheable(value = "mapbox", key = "'directions_' + #startLon + '_' + #startLat + '_' + #endLon + '_' + #endLat + '_' + (#stops != null ? #stops.hashCode() : 0)")
    public String getDirectionsRoute(double startLon, double startLat,
                                     double endLon, double endLat,
                                     List<double[]> stops) {

        rateLimitUtil.enforceRateLimitMapBox(RATE_LIMIT_KEY);

        // Build coordinate string
        StringBuilder coordBuilder = new StringBuilder();
        coordBuilder.append(startLon).append(",").append(startLat);
        if (stops != null && !stops.isEmpty()) {
            for (double[] stop : stops) {
                coordBuilder.append(";").append(stop[0]).append(",").append(stop[1]);
            }
        }
        coordBuilder.append(";").append(endLon).append(",").append(endLat);

        String coordinates = coordBuilder.toString();

        String directionUrl = String.format(
                "https://api.mapbox.com/directions/v5/mapbox/driving/%s?access_token=%s&geometries=geojson&overview=full",
                coordinates, mapboxToken
        );

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(directionUrl, String.class);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode coords = root.path("routes").get(0).path("geometry").path("coordinates");
            return coords.toString(); // Return only the coordinates array
        } catch (Exception e) {
            return "[]"; // Return empty array if parsing fails
        }
    }
}