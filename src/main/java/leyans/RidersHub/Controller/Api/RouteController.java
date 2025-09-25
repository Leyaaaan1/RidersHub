package leyans.RidersHub.Controller.Api;

import jakarta.servlet.http.HttpServletRequest;
import leyans.RidersHub.DTO.RouteRequestDTO;
import leyans.RidersHub.Service.MapService.DirectionsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import leyans.RidersHub.Util.RiderUtil;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/route")
public class RouteController {

    private final DirectionsService directionsService;
    private final RiderUtil riderUtil;

    @Autowired
    public RouteController(DirectionsService directionsService, RiderUtil riderUtil) {
        this.directionsService = directionsService;
        this.riderUtil = riderUtil;
    }

    @PostMapping("/preview")
    public ResponseEntity<String> getRoutePreview(@RequestBody RouteRequestDTO request) {
        System.out.println("=== ROUTE PREVIEW API CALLED ===");

        try {
            // Authentication check
            String currentUsername = riderUtil.getCurrentUsername();
            if (currentUsername == null || currentUsername.trim().isEmpty()) {
                System.err.println("❌ Route preview: Authentication failed - no username");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Authentication required\"}");
            }

            System.out.println("✅ Authenticated user: " + currentUsername);

            // Validate request
            if (request == null) {
                System.err.println("❌ Route preview: Null request body");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Request body is required\"}");
            }

            // Log request details for debugging
            System.out.println("Route preview request details:");
            System.out.println("  - Start coordinates: [" + request.getStartLng() + ", " + request.getStartLat() + "]");
            System.out.println("  - End coordinates: [" + request.getEndLng() + ", " + request.getEndLat() + "]");
            System.out.println("  - Stop points: " + (request.getStopPoints() != null ? request.getStopPoints().size() : 0));

            // Validate coordinates
            if (!isValidCoordinate(request.getStartLng(), request.getStartLat())) {
                System.err.println("❌ Invalid starting coordinates");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Invalid starting coordinates: [" + request.getStartLng() + ", " + request.getStartLat() + "]\"}");
            }

            if (!isValidCoordinate(request.getEndLng(), request.getEndLat())) {
                System.err.println("❌ Invalid ending coordinates");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Invalid ending coordinates: [" + request.getEndLng() + ", " + request.getEndLat() + "]\"}");
            }

            System.out.println("✅ Coordinates validation passed");

            // Get route data from ORS
            System.out.println("Calling DirectionsService...");
            String routeData = directionsService.getRoutePreview(
                    request.getStartLng(),
                    request.getStartLat(),
                    request.getEndLng(),
                    request.getEndLat(),
                    request.getStopPoints()
            );

            // Validate response
            if (routeData == null || routeData.trim().isEmpty()) {
                System.err.println("❌ Route preview: Empty response from DirectionsService");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"No route data received from routing service\"}");
            }

            // Basic validation of route response
            if (!routeData.contains("\"routes\"")) {
                System.err.println("❌ Route preview: Invalid route response format");
                System.err.println("Response preview: " + routeData.substring(0, Math.min(200, routeData.length())));
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Invalid route data format received\"}");
            }

            System.out.println("✅ Route preview successful");
            System.out.println("Response length: " + routeData.length() + " characters");

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json; charset=utf-8")
                    .header("Cache-Control", "no-cache")
                    .body(routeData);

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Route preview: Invalid argument - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Content-Type", "application/json")
                    .body("{\"error\":\"" + escapeJsonString(e.getMessage()) + "\"}");

        } catch (RuntimeException e) {
            System.err.println("❌ Route preview: Runtime error - " + e.getMessage());
            e.printStackTrace();

            String errorMessage;
            HttpStatus status;

            // Handle specific ORS API errors
            if (e.getMessage().contains("authentication") || e.getMessage().contains("API key")) {
                errorMessage = "Route service configuration error";
                status = HttpStatus.SERVICE_UNAVAILABLE;
            } else if (e.getMessage().contains("Rate limit")) {
                errorMessage = "Too many requests. Please try again later.";
                status = HttpStatus.TOO_MANY_REQUESTS;
            } else if (e.getMessage().contains("Network timeout") || e.getMessage().contains("connection error")) {
                errorMessage = "Route service temporarily unavailable due to network issues";
                status = HttpStatus.SERVICE_UNAVAILABLE;
            } else if (e.getMessage().contains("server error") || e.getMessage().contains("service unavailable")) {
                errorMessage = "Route service temporarily unavailable";
                status = HttpStatus.SERVICE_UNAVAILABLE;
            } else {
                errorMessage = "Route calculation failed. Please try again.";
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }

            return ResponseEntity.status(status)
                    .header("Content-Type", "application/json")
                    .body("{\"error\":\"" + errorMessage + "\"}");

        } catch (Exception e) {
            System.err.println("❌ Route preview: Unexpected error - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body("{\"error\":\"An unexpected error occurred. Please try again.\"}");
        }
    }

    @PostMapping("/directions")
    public ResponseEntity<String> getRouteDirections(@RequestBody RouteRequestDTO request) {
        System.out.println("=== ROUTE DIRECTIONS API CALLED ===");

        try {
            // Authentication check
            String currentUsername = riderUtil.getCurrentUsername();
            if (currentUsername == null || currentUsername.trim().isEmpty()) {
                System.err.println("❌ Route directions: Authentication failed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Authentication required\"}");
            }

            System.out.println("✅ Authenticated user: " + currentUsername);

            // Validate request
            if (request == null) {
                System.err.println("❌ Route directions: Null request body");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Request body is required\"}");
            }

            // Log request details
            System.out.println("Route directions request details:");
            System.out.println("  - Start: [" + request.getStartLng() + ", " + request.getStartLat() + "]");
            System.out.println("  - End: [" + request.getEndLng() + ", " + request.getEndLat() + "]");
            System.out.println("  - Stop points: " + (request.getStopPoints() != null ? request.getStopPoints().size() : 0));

            // Validate coordinates
            if (!isValidCoordinate(request.getStartLng(), request.getStartLat())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Invalid starting coordinates\"}");
            }
            if (!isValidCoordinate(request.getEndLng(), request.getEndLat())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"Invalid ending coordinates\"}");
            }

            // Get route directions from ORS
            String routeDirections = directionsService.getRouteDirections(
                    request.getStartLng(), request.getStartLat(),
                    request.getEndLng(), request.getEndLat(),
                    request.getStopPoints(),
                    "driving-car"
            );

            // Validate response
            if (routeDirections == null || routeDirections.trim().isEmpty()) {
                System.err.println("❌ Route directions: Empty response");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .header("Content-Type", "application/json")
                        .body("{\"error\":\"No route data received\"}");
            }

            System.out.println("✅ Route directions successful");

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json; charset=utf-8")
                    .header("Cache-Control", "no-cache")
                    .body(routeDirections);

        } catch (Exception e) {
            System.err.println("❌ Route directions error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body("{\"error\":\"Route calculation failed\"}");
        }
    }

     private boolean isValidCoordinate(double longitude, double latitude) {
        boolean isValid = !Double.isNaN(longitude) && !Double.isNaN(latitude) &&
                Double.isFinite(longitude) && Double.isFinite(latitude) &&
                longitude >= -180.0 && longitude <= 180.0 &&
                latitude >= -90.0 && latitude <= 90.0 &&
                !(longitude == 0.0 && latitude == 0.0); // Exclude null island

        if (!isValid) {
            System.err.println("❌ Invalid coordinate: lng=" + longitude + ", lat=" + latitude);
        }

        return isValid;
    }

    // Helper method to escape JSON strings
    private String escapeJsonString(String input) {
        if (input == null) return "";
        return input.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }
}