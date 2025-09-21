package leyans.RidersHub.Service.MapService.MapBox;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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





    public String getDirectionsRoute(double startLon, double startLat,
                                     double endLon, double endLat,
                                     List<double[]> stops) {
        try {
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

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            // Check if the response contains an error
            if (root.has("code") && !root.get("code").asText().equals("Ok")) {
                String errorMessage = root.has("message") ? root.get("message").asText() : "Unknown Mapbox error";
                throw new RuntimeException("Mapbox API error: " + errorMessage);
            }

            // Check if routes exist
            if (!root.has("routes") || root.get("routes").size() == 0) {
                throw new RuntimeException("No routes found for the given coordinates");
            }

            JsonNode coords = root.path("routes").get(0).path("geometry").path("coordinates");
            return coords.toString();

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // Handle HTTP errors (like 422)
            System.err.println("Mapbox HTTP error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Route request failed: " + e.getMessage() + " (Distance may be too long or coordinates invalid)");
        } catch (Exception e) {
            System.err.println("Error getting route directions: " + e.getMessage());
            throw new RuntimeException("Failed to get route directions: " + e.getMessage());
        }
    }
}