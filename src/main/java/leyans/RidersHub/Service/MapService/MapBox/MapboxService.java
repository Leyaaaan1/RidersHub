package leyans.RidersHub.Service.MapService.MapBox;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.Util.RateLimitUtil;
import leyans.RidersHub.model.StopPoint;
import org.cloudinary.json.JSONArray;
import org.cloudinary.json.JSONObject;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.awt.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import org.locationtech.jts.geom.Point;
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


    public List<Coordinate> getRouteCoordinates(org.locationtech.jts.geom.Point startPoint,
                                                List<StopPoint> stopPoints,
                                                org.locationtech.jts.geom.Point endPoint) {
        rateLimitUtil.enforceRateLimitMapBox(RATE_LIMIT_KEY);

        // Check if the direct distance is likely to exceed Mapbox limits
        double distanceKm = calculateApproximateDistance(
                startPoint.getY(), startPoint.getX(),
                endPoint.getY(), endPoint.getX()
        );

        if (distanceKm > 400) { // Mapbox typically limits routes to ~400-500km
            // Create a straight-line fallback route
            return createStraightLineRoute(startPoint, stopPoints, endPoint);
        }

        // Original code for making Mapbox API call...
        StringBuilder coordinatesBuilder = new StringBuilder();
        coordinatesBuilder.append(startPoint.getX()).append(",").append(startPoint.getY());

        // Add all stop points
        for (StopPoint stop : stopPoints) {
            coordinatesBuilder.append(";").append(stop.getStopLocation().getX())
                    .append(",").append(stop.getStopLocation().getY());
        }

        // Add end point
        coordinatesBuilder.append(";").append(endPoint.getX())
                .append(",").append(endPoint.getY());

        String coordinates = coordinatesBuilder.toString();
        String url = String.format("https://api.mapbox.com/directions/v5/mapbox/driving/%s?geometries=geojson&access_token=%s",
                coordinates, mapboxToken);

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.body());

            List<Coordinate> routeCoordinates = new ArrayList<>();
            JsonNode routes = rootNode.path("routes");

            if (routes.size() > 0) {
                JsonNode geometry = routes.get(0).path("geometry");
                JsonNode coordinates_array = geometry.path("coordinates");

                for (JsonNode coord : coordinates_array) {
                    double lon = coord.get(0).asDouble();
                    double lat = coord.get(1).asDouble();
                    routeCoordinates.add(new Coordinate(lon, lat));
                }

                return routeCoordinates;
            } else {
                // No route found, fallback to straight line
                return createStraightLineRoute(startPoint, stopPoints, endPoint);
            }
        } catch (Exception e) {
            // If we get the specific Mapbox distance error, use fallback
            if (e.getMessage() != null && e.getMessage().contains("Route exceeds maximum distance")) {
                return createStraightLineRoute(startPoint, stopPoints, endPoint);
            }
            throw new RuntimeException("Failed to get directions from Mapbox", e);
        }
    }

    // Helper method to calculate straight-line distance between points
    private double calculateApproximateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Create a straight line route as fallback
    private List<Coordinate> createStraightLineRoute(Point startPoint, List<StopPoint> stopPoints, Point endPoint) {
        List<Coordinate> coordinates = new ArrayList<>();

        // Add starting point
        coordinates.add(new Coordinate(startPoint.getX(), startPoint.getY()));

        // Add stop points
        for (StopPoint stop : stopPoints) {
            coordinates.add(new Coordinate(stop.getStopLocation().getX(), stop.getStopLocation().getY()));
        }

        // Add ending point
        coordinates.add(new Coordinate(endPoint.getX(), endPoint.getY()));

        return coordinates;
    }

}