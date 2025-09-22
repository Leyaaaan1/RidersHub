package leyans.RidersHub.Service.MapService;

import leyans.RidersHub.DTO.StopPointDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.*;

@Service
public class DirectionsService {

    private static final String ORS_BASE_URL = "https://api.openrouteservice.org";
    private final RestTemplate restTemplate;

    @Value("${ORS_API}")
    private String apiKey;

    @Value("${USER_AGENT}")
    private String userAgent;

    public DirectionsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getRouteDirections(double startLng, double startLat,
                                     double endLng, double endLat,
                                     List<StopPointDTO> stopPoints,
                                     String profile) {

        String url = ORS_BASE_URL + "/v2/directions/" + profile;

        System.out.println("ORS API URL: " + url);
        System.out.println("API Key configured: " + (apiKey != null && !apiKey.isEmpty()));

        // Validate coordinates first
        if (!isValidCoordinate(startLng, startLat) || !isValidCoordinate(endLng, endLat)) {
            throw new IllegalArgumentException("Invalid start or end coordinates");
        }

        // Build request body
        Map<String, Object> requestBody = buildDirectionsRequest(
                startLng, startLat, endLng, endLat, stopPoints
        );

        System.out.println("Request coordinates: " + requestBody.get("coordinates"));

        // Set headers - ORS uses Authorization header with API key
        HttpHeaders headers = createHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // OpenRouteService expects the API key directly in Authorization header
        // No "Bearer" prefix needed
        headers.set("Authorization", apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            System.out.println("ORS Response Status: " + response.getStatusCode());
            System.out.println("ORS Response Body (first 200 chars): " +
                    (response.getBody() != null ? response.getBody().substring(0, Math.min(200, response.getBody().length())) : "null"));

            return response.getBody();

        } catch (HttpClientErrorException e) {
            System.err.println("HTTP Error calling ORS API: " + e.getStatusCode());
            System.err.println("Response body: " + e.getResponseBodyAsString());

            // Handle specific error cases
            if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 403) {
                throw new RuntimeException("API authentication failed. Please check your ORS API key. Status: " + e.getStatusCode());
            } else if (e.getStatusCode().value() == 400) {
                throw new RuntimeException("Bad request to ORS API. Check coordinates and parameters. Response: " + e.getResponseBodyAsString());
            } else if (e.getStatusCode().value() == 429) {
                throw new RuntimeException("Rate limit exceeded for ORS API");
            }

            throw new RuntimeException("Failed to get route directions: " + e.getMessage(), e);

        } catch (Exception e) {
            System.err.println("Error calling ORS Directions API: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get route directions: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> buildDirectionsRequest(double startLng, double startLat,
                                                       double endLng, double endLat,
                                                       List<StopPointDTO> stopPoints) {

        List<List<Double>> coordinates = new ArrayList<>();

        // Add start point [longitude, latitude]
        coordinates.add(Arrays.asList(startLng, startLat));

        // Add valid stop points only
        if (stopPoints != null && !stopPoints.isEmpty()) {
            for (StopPointDTO stop : stopPoints) {
                // Validate stop point coordinates before adding
                if (isValidCoordinate(stop.getStopLongitude(), stop.getStopLatitude())) {
                    coordinates.add(Arrays.asList(stop.getStopLongitude(), stop.getStopLatitude()));
                } else {
                    System.out.println("Skipping invalid stop point: [" + stop.getStopLongitude() + ", " + stop.getStopLatitude() + "]");
                }
            }
        }

        // Add end point
        coordinates.add(Arrays.asList(endLng, endLat));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("coordinates", coordinates);

        // Basic required parameters
        requestBody.put("format", "json");
        requestBody.put("geometry", true);

        // Remove the unsupported 'geometry_format' parameter
        // The default format should work fine

        // Optional parameters that are supported
        requestBody.put("instructions", false);
        requestBody.put("elevation", false);
        requestBody.put("continue_straight", false);
        requestBody.put("preference", "recommended");

        // Add route summary information
        requestBody.put("summary", true);

        return requestBody;
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8");
        headers.set("Accept-Language", "en");

        if (userAgent != null && !userAgent.isEmpty()) {
            headers.set("User-Agent", userAgent);
        } else {
            headers.set("User-Agent", "RidersHub/1.0");
        }

        return headers;
    }

    private boolean isValidCoordinate(double longitude, double latitude) {
        // Check if coordinates are valid (not 0,0 and within valid ranges)
        return longitude != 0.0 && latitude != 0.0 &&
                longitude >= -180.0 && longitude <= 180.0 &&
                latitude >= -90.0 && latitude <= 90.0;
    }

}