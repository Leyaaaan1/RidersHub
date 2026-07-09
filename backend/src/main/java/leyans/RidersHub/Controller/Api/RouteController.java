package leyans.RidersHub.Controller.Api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.Service.MapService.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import leyans.RidersHub.DTO.Request.RidesDTO.RouteRequestDTO;

@RestController
@RequestMapping("/routes")
public class RouteController {

    private final RouteService routeService; // Use your existing service

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/preview")
    public ResponseEntity<JsonNode> getRoutePreview(@RequestBody RouteRequestDTO routeRequest) {
        try {

            // Validate coordinates
            if (routeRequest.getStartLat() == 0 || routeRequest.getStartLng() == 0 ||
                    routeRequest.getEndLat() == 0 || routeRequest.getEndLng() == 0) {
                return ResponseEntity.badRequest().body(null);
            }

            // Get the full GeoJSON from ORS API
            String routeGeoJSON = routeService.getRouteDirections(
                    routeRequest.getStartLng(),
                    routeRequest.getStartLat(),
                    routeRequest.getEndLng(),
                    routeRequest.getEndLat(),
                    routeRequest.getStopPoints(),
                    "driving-car"
            );

            if (routeGeoJSON != null && !routeGeoJSON.trim().isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode geoJsonNode = mapper.readTree(routeGeoJSON);
                return ResponseEntity.ok(geoJsonNode);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }    @GetMapping("/coordinate/{generatedRidesId}")
    public ResponseEntity<JsonNode> getRideRoute(@PathVariable String generatedRidesId) {
        JsonNode geoJson = routeService.getSavedRouteGeoJson(generatedRidesId);
        return ResponseEntity.ok(geoJson);
    }


}