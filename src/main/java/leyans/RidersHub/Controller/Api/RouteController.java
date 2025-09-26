package leyans.RidersHub.Controller.Api;

import com.fasterxml.jackson.databind.JsonNode;
import leyans.RidersHub.Service.MapService.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import leyans.RidersHub.DTO.RouteRequestDTO;

@RestController
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteService routeService; // Use your existing service

    /**
     * Get route directions between points using existing DirectionsService
     * Returns simplified coordinate array for frontend
     */
    @PostMapping("/preview")
    public ResponseEntity<String> getRoutePreview(@RequestBody RouteRequestDTO routeRequest) {
        try {
            System.out.println("=== ROUTE PREVIEW REQUEST ===");
            System.out.println("Start: " + routeRequest.getStartLat() + ", " + routeRequest.getStartLng());
            System.out.println("End: " + routeRequest.getEndLat() + ", " + routeRequest.getEndLng());
            System.out.println("Stop points: " + (routeRequest.getStopPoints() != null ? routeRequest.getStopPoints().size() : 0));

            // Use your existing DirectionsService method
            String routeGeoJSON = routeService.getRouteDirections(
                    routeRequest.getStartLng(),
                    routeRequest.getStartLat(),
                    routeRequest.getEndLng(),
                    routeRequest.getEndLat(),
                    routeRequest.getStopPoints(),
                    "driving-car"
            );

            if (routeGeoJSON != null && !routeGeoJSON.trim().isEmpty()) {
                // Extract coordinates from GeoJSON and return as simple array
                String simplifiedCoords = extractCoordinatesFromGeoJSON(routeGeoJSON);
                System.out.println("Returning simplified coordinates: " + simplifiedCoords.substring(0, Math.min(200, simplifiedCoords.length())) + "...");
                return ResponseEntity.ok(simplifiedCoords);
            } else {
                System.out.println("No route data received from DirectionsService");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("[]");
            }
        } catch (Exception e) {
            System.err.println("Error in getRoutePreview: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("[]");
        }
    }

    @GetMapping("/coordinate/{generatedRidesId}")
    public ResponseEntity<JsonNode> getRideRoute(@PathVariable Integer generatedRidesId) {
        JsonNode geoJson = routeService.getSavedRouteGeoJson(generatedRidesId);
        return ResponseEntity.ok(geoJson);
    }

    /**
     * Extract coordinates from GeoJSON and return as simple coordinate array
     */
    private String extractCoordinatesFromGeoJSON(String geoJsonRoute) {
        try {
            if (geoJsonRoute == null || geoJsonRoute.trim().isEmpty()) {
                return "[]";
            }

            // Parse the GeoJSON string to extract coordinates
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode rootNode = mapper.readTree(geoJsonRoute);

            com.fasterxml.jackson.databind.JsonNode featuresNode = rootNode.get("features");
            if (featuresNode != null && featuresNode.isArray() && featuresNode.size() > 0) {
                com.fasterxml.jackson.databind.JsonNode geometry = featuresNode.get(0).get("geometry");
                com.fasterxml.jackson.databind.JsonNode coordinates = geometry.get("coordinates");

                // Convert GeoJSON coordinates [lng, lat] to [lat, lng] format for frontend
                java.util.List<double[]> coordList = new java.util.ArrayList<>();
                if (coordinates.isArray()) {
                    for (com.fasterxml.jackson.databind.JsonNode coord : coordinates) {
                        if (coord.isArray() && coord.size() >= 2) {
                            // Convert from [lng, lat] to [lat, lng]
                            coordList.add(new double[]{
                                    coord.get(1).asDouble(), // latitude
                                    coord.get(0).asDouble()  // longitude
                            });
                        }
                    }
                }

                return mapper.writeValueAsString(coordList);
            }

            return "[]";
        } catch (Exception e) {
            System.err.println("Error extracting coordinates from GeoJSON: " + e.getMessage());
            return "[]";
        }
    }
}