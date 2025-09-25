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
import org.springframework.web.client.ResourceAccessException;

import java.util.*;

@Service
public class DirectionsService {

    private static final String ORS_BASE_URL = "https://api.openrouteservice.org";
    private final RestTemplate restTemplate;

    @Value("${ORS_API:}")
    private String apiKey;

    @Value("${USER_AGENT:RidersHub/1.0}")
    private String userAgent;

    public DirectionsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Enhanced method for ride creation with detailed route geometry
    public String getRouteDirections(double startLng, double startLat,
                                     double endLng, double endLat,
                                     List<StopPointDTO> stopPoints,
                                     String profile) {

        // Validate API key first
        if (apiKey == null || apiKey.trim().isEmpty()) {
            System.err.println("ERROR: ORS API key is not configured. Please check your application properties.");
            throw new RuntimeException("ORS API key is not configured");
        }

        String url = ORS_BASE_URL + "/v2/directions/" + profile;

        System.out.println("=== ORS API REQUEST DEBUG ===");
        System.out.println("URL: " + url);
        System.out.println("API Key configured: " + (apiKey != null && !apiKey.isEmpty()));
        System.out.println("Start coordinates: [" + startLng + ", " + startLat + "]");
        System.out.println("End coordinates: [" + endLng + ", " + endLat + "]");
        System.out.println("Stop points count: " + (stopPoints != null ? stopPoints.size() : 0));

        if (!isValidCoordinate(startLng, startLat) || !isValidCoordinate(endLng, endLat)) {
            throw new IllegalArgumentException("Invalid start or end coordinates: start=[" + startLng + "," + startLat + "], end=[" + endLng + "," + endLat + "]");
        }

        Map<String, Object> requestBody = buildDirectionsRequest(startLng, startLat, endLng, endLat, stopPoints);
        System.out.println("Request body: " + requestBody);

        HttpHeaders headers = createHeaders();
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            System.out.println("Making request to ORS API...");
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            String responseBody = response.getBody();
            System.out.println("ORS API response status: " + response.getStatusCode());
            System.out.println("Response body length: " + (responseBody != null ? responseBody.length() : 0));

            return responseBody;

        } catch (HttpClientErrorException e) {
            System.err.println("❌ ORS API HTTP Error:");
            System.err.println("Status: " + e.getStatusCode());
            System.err.println("Response: " + e.getResponseBodyAsString());
            handleHttpClientError(e);
            throw new RuntimeException("Failed to get route directions: " + e.getMessage(), e);

        } catch (ResourceAccessException e) {
            System.err.println("❌ ORS API Network Error: " + e.getMessage());
            throw new RuntimeException("Network timeout or connection error when calling ORS API", e);

        } catch (Exception e) {
            System.err.println("❌ Unexpected error calling ORS Directions API:");
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get route directions: " + e.getMessage(), e);
        }
    }

    // Enhanced method for real-time route preview
    public String getRoutePreview(double startLng, double startLat,
                                  double endLng, double endLat,
                                  List<StopPointDTO> stopPoints) {

        System.out.println("=== ROUTE PREVIEW REQUEST ===");
        System.out.println("Start: [" + startLng + ", " + startLat + "]");
        System.out.println("End: [" + endLng + ", " + endLat + "]");
        System.out.println("Stop points count: " + (stopPoints != null ? stopPoints.size() : 0));

        if (stopPoints != null) {
            for (int i = 0; i < stopPoints.size(); i++) {
                StopPointDTO stop = stopPoints.get(i);
                System.out.println("Stop " + (i+1) + ": [" + stop.getStopLongitude() + ", " + stop.getStopLatitude() + "] - " + stop.getStopName());
            }
        }

        // Validate coordinates
        if (!isValidCoordinate(startLng, startLat)) {
            throw new IllegalArgumentException("Invalid starting coordinates: [" + startLng + ", " + startLat + "]");
        }
        if (!isValidCoordinate(endLng, endLat)) {
            throw new IllegalArgumentException("Invalid ending coordinates: [" + endLng + ", " + endLat + "]");
        }

        return getRouteDirections(startLng, startLat, endLng, endLat, stopPoints, "driving-car");
    }

    private Map<String, Object> buildDirectionsRequest(double startLng, double startLat,
                                                       double endLng, double endLat,
                                                       List<StopPointDTO> stopPoints) {

        List<List<Double>> coordinates = new ArrayList<>();

        // Add starting point
        coordinates.add(Arrays.asList(startLng, startLat));

        // Add stop points if any
        if (stopPoints != null && !stopPoints.isEmpty()) {
            System.out.println("Processing " + stopPoints.size() + " stop points:");
            for (int i = 0; i < stopPoints.size(); i++) {
                StopPointDTO stop = stopPoints.get(i);
                if (isValidCoordinate(stop.getStopLongitude(), stop.getStopLatitude())) {
                    coordinates.add(Arrays.asList(stop.getStopLongitude(), stop.getStopLatitude()));
                    System.out.println("✅ Added stop point " + (i + 1) + ": [" +
                            stop.getStopLongitude() + ", " + stop.getStopLatitude() + "] - " + stop.getStopName());
                } else {
                    System.out.println("❌ Skipping invalid stop point " + (i + 1) + ": [" +
                            stop.getStopLongitude() + ", " + stop.getStopLatitude() + "]");
                }
            }
        }

        // Add ending point
        coordinates.add(Arrays.asList(endLng, endLat));

        System.out.println("Total waypoints for route: " + coordinates.size());

        // Build request body with correct ORS API v2 parameters
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("coordinates", coordinates);

        // Correct parameters for ORS API v2
        requestBody.put("format", "json");
        requestBody.put("geometry", true);           // Request geometry
        requestBody.put("instructions", false);     // Don't need turn-by-turn instructions
        requestBody.put("elevation", false);        // Don't need elevation data

        // Use recommended preference for better routing
        requestBody.put("preference", "recommended");

        // Add radiuses to handle routing near coordinates (in meters)
        List<Integer> radiuses = new ArrayList<>();
        for (int i = 0; i < coordinates.size(); i++) {
            radiuses.add(1000); // 1km radius for each waypoint
        }
        requestBody.put("radiuses", radiuses);

        // Enhanced options for better routing
        Map<String, Object> options = new HashMap<>();
        options.put("avoid_features", Arrays.asList("tollways")); // Avoid toll roads
        options.put("profile_params", createProfileParams());
        requestBody.put("options", options);

        System.out.println("Final request body: " + requestBody);
        return requestBody;
    }

    private Map<String, Object> createProfileParams() {
        Map<String, Object> profileParams = new HashMap<>();

        // Driving car specific parameters
        Map<String, Object> restrictions = new HashMap<>();
        restrictions.put("maximum_speed", 130); // km/h
        profileParams.put("restrictions", restrictions);

        Map<String, Object> weightings = new HashMap<>();
        weightings.put("steepness_difficulty", 1);
        weightings.put("green", 0.4);
        weightings.put("quiet", 0.8);
        profileParams.put("weightings", weightings);

        return profileParams;
    }



    private void handleHttpClientError(HttpClientErrorException e) {
        int statusCode = e.getStatusCode().value();
        String responseBody = e.getResponseBodyAsString();

        System.err.println("ORS API Error Details:");
        System.err.println("Status Code: " + statusCode);
        System.err.println("Response Body: " + responseBody);

        switch (statusCode) {
            case 400:
                throw new RuntimeException("Bad request to ORS API. Check coordinates and parameters. Response: " + responseBody);
            case 401:
                throw new RuntimeException("ORS API authentication failed. Please check your API key.");
            case 403:
                throw new RuntimeException("ORS API access forbidden. Check your API key permissions.");
            case 404:
                throw new RuntimeException("ORS API endpoint not found. Check the service URL and profile.");
            case 429:
                throw new RuntimeException("ORS API rate limit exceeded. Please wait before making more requests.");
            case 500:
                throw new RuntimeException("ORS API server error. Please try again later.");
            case 502:
            case 503:
            case 504:
                throw new RuntimeException("ORS API service unavailable. Please try again later.");
            default:
                throw new RuntimeException("ORS API error: " + statusCode + " - " + responseBody);
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();

        // Set content type
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Set accept header
        headers.set("Accept", "application/json, application/geo+json");

        // Set authorization with proper formatting
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            headers.set("Authorization", apiKey.trim());
            System.out.println("Authorization header set with API key");
        } else {
            System.err.println("WARNING: No API key available for ORS authorization");
        }

        // Set user agent
        if (userAgent != null && !userAgent.isEmpty()) {
            headers.set("User-Agent", userAgent);
        } else {
            headers.set("User-Agent", "RidersHub/1.0 (Route Service)");
        }

        System.out.println("Request headers configured");
        return headers;
    }

    private boolean isValidCoordinate(double longitude, double latitude) {
        boolean isValid = !Double.isNaN(longitude) && !Double.isNaN(latitude) &&
                Double.isFinite(longitude) && Double.isFinite(latitude) &&
                longitude >= -180.0 && longitude <= 180.0 &&
                latitude >= -90.0 && latitude <= 90.0 &&
                !(longitude == 0.0 && latitude == 0.0); // Exclude null island

        if (!isValid) {
            System.err.println("Invalid coordinate: longitude=" + longitude + ", latitude=" + latitude);
        }

        return isValid;
    }


}