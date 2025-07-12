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

        StringBuilder coordinatesBuilder = new StringBuilder();
        // Use longitude (X) and latitude (Y) in the proper order for Mapbox API
        coordinatesBuilder.append(startPoint.getX()).append(",").append(startPoint.getY());

        for (StopPoint stop : stopPoints) {
            coordinatesBuilder.append(";")
                    .append(stop.getStopLocation().getX()).append(",")
                    .append(stop.getStopLocation().getY());
        }

        coordinatesBuilder.append(";").append(endPoint.getX()).append(",").append(endPoint.getY());

        // Change "cycling" to "driving" for car routes
        String profile = "driving";
        String url = "https://api.mapbox.com/directions/v5/mapbox/" + profile + "/" +
                coordinatesBuilder.toString() +
                "?geometries=geojson&access_token=" + mapboxToken;

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            String body = response.body();

            // Add better error handling
            if (body.contains("error") || !body.contains("routes")) {
                System.err.println("Mapbox API error: " + body);
                throw new RuntimeException("Invalid response from Mapbox API: " + body);
            }

            JSONArray coords = new JSONObject(body)
                    .getJSONArray("routes")
                    .getJSONObject(0)
                    .getJSONObject("geometry")
                    .getJSONArray("coordinates");

            List<Coordinate> coordinateList = new ArrayList<>();
            for (int i = 0; i < coords.length(); i++) {
                JSONArray coordPair = coords.getJSONArray(i);
                coordinateList.add(new Coordinate(coordPair.getDouble(0), coordPair.getDouble(1)));
            }
            return coordinateList;

        } catch (Exception e) {
            System.err.println("Failed to get directions from Mapbox: " + e.getMessage());
            throw new RuntimeException("Failed to get directions from Mapbox", e);
        }
    }

}