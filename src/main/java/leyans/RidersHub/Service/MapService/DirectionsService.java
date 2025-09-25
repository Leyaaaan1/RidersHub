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

            // Add detailed debugging
            debugORSResponse(responseBody);

            if (responseBody != null && responseBody.contains("\"routes\"")) {
                System.out.println("✅ ORS API request successful");
            } else {
                System.err.println("⚠️ ORS API response may be invalid");
            }

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

    private void debugORSResponse(String responseBody) {
        System.out.println("=== ORS RESPONSE DETAILED DEBUG ===");

        if (responseBody == null || responseBody.isEmpty()) {
            System.out.println("Response is null or empty");
            return;
        }

        System.out.println("Response length: " + responseBody.length());

        // Basic structure checks
        boolean hasRoutes = responseBody.contains("\"routes\"");
        boolean hasGeometry = responseBody.contains("\"geometry\"");
        boolean hasCoordinates = responseBody.contains("\"coordinates\"");
        boolean hasError = responseBody.contains("\"error\"");

        System.out.println("Structure check:");
        System.out.println("  - Has routes: " + hasRoutes);
        System.out.println("  - Has geometry: " + hasGeometry);
        System.out.println("  - Has coordinates: " + hasCoordinates);
        System.out.println("  - Has error: " + hasError);

        if (hasError) {
            System.out.println("ERROR DETECTED in ORS response");
            // Find and print the error section
            int errorStart = responseBody.indexOf("\"error\"");
            if (errorStart > -1) {
                int errorEnd = Math.min(errorStart + 300, responseBody.length());
                System.out.println("Error section: " + responseBody.substring(errorStart, errorEnd));
            }
            return;
        }

        if (hasRoutes) {
            // Try to extract and analyze the first route
            int routesStart = responseBody.indexOf("\"routes\"");
            if (routesStart > -1) {
                // Find the geometry section
                int geometryStart = responseBody.indexOf("\"geometry\"", routesStart);
                if (geometryStart > -1) {
                    int geometryEnd = responseBody.indexOf("}", geometryStart);
                    if (geometryEnd == -1) geometryEnd = geometryStart + 500;
                    String geometrySection = responseBody.substring(geometryStart, Math.min(geometryEnd + 1, responseBody.length()));
                    System.out.println("Geometry section: " + geometrySection);

                    // Check for coordinates within geometry
                    int coordStart = responseBody.indexOf("\"coordinates\"", geometryStart);
                    if (coordStart > -1 && coordStart < geometryEnd) {
                        // Find the coordinates array
                        int coordArrayStart = responseBody.indexOf("[", coordStart);
                        if (coordArrayStart > -1) {
                            // Count how many coordinate pairs we have
                            String coordSection = responseBody.substring(coordArrayStart, Math.min(coordArrayStart + 1000, responseBody.length()));
                            int coordCount = coordSection.split("\\[").length - 1; // Rough count of coordinate pairs
                            System.out.println("Estimated coordinate pairs in response: " + (coordCount / 2));

                            // Show first few coordinates
                            int firstCoordEnd = Math.min(coordArrayStart + 200, responseBody.length());
                            System.out.println("First coordinates sample: " + responseBody.substring(coordArrayStart, firstCoordEnd));
                        }
                    }
                } else {
                    System.out.println("No geometry section found in routes");
                }
            }
        } else {
            System.out.println("No routes found in response");
            // Print first 500 characters to see what we actually got
            String preview = responseBody.length() > 500 ? responseBody.substring(0, 500) + "..." : responseBody;
            System.out.println("Response preview: " + preview);
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

        String result = getRouteDirections(startLng, startLat, endLng, endLat, stopPoints, "driving-car");

        // Add response debugging
        if (result != null) {
            System.out.println("=== ORS RESPONSE DEBUG ===");
            System.out.println("Response length: " + result.length());

            // Check if response contains route geometry
            boolean hasRoutes = result.contains("\"routes\"");
            boolean hasGeometry = result.contains("\"geometry\"");
            boolean hasCoordinates = result.contains("\"coordinates\"");

            System.out.println("Has routes: " + hasRoutes);
            System.out.println("Has geometry: " + hasGeometry);
            System.out.println("Has coordinates: " + hasCoordinates);

            if (hasGeometry) {
                // Extract a sample of the geometry to verify format
                int geometryIndex = result.indexOf("\"geometry\"");
                if (geometryIndex > -1) {
                    String geometrySample = result.substring(geometryIndex, Math.min(geometryIndex + 200, result.length()));
                    System.out.println("Geometry sample: " + geometrySample);
                }
            }
        }

        return result;
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

        // Build request body with correct ORS API parameters
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("coordinates", coordinates);
        requestBody.put("format", "json");        // Use json format, not geojson
        requestBody.put("geometry", true);        // Include geometry in response
        requestBody.put("instructions", false);   // We don't need turn-by-turn instructions
        requestBody.put("elevation", false);      // We don't need elevation data
        requestBody.put("continue_straight", false);
        requestBody.put("preference", "recommended");

        // Add options for better routing
        Map<String, Object> options = new HashMap<>();
        options.put("avoid_features", new ArrayList<>()); // Empty array for no restrictions
        requestBody.put("options", options);

        System.out.println("Final request body: " + requestBody);
        return requestBody;
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
        headers.set("Accept", "application/json");

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

        System.out.println("Request headers: " + headers);
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

    // Method for testing ORS API connectivity
    public boolean testORSConnection() {
        try {
            System.out.println("=== TESTING ORS API CONNECTION ===");

            if (apiKey == null || apiKey.trim().isEmpty()) {
                System.err.println("❌ No ORS API key configured");
                return false;
            }

            // Test with simple coordinates (Davao City area)
            double testStartLng = 125.6128;
            double testStartLat = 7.0731;
            double testEndLng = 125.6200;
            double testEndLat = 7.0800;

            getRouteDirections(testStartLng, testStartLat, testEndLng, testEndLat, null, "driving-car");
            System.out.println("✅ ORS API connection test successful");
            return true;

        } catch (Exception e) {
            System.err.println("❌ ORS API connection test failed: " + e.getMessage());
            return false;
        }
    }


}