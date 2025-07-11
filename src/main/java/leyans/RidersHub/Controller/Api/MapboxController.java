package leyans.RidersHub.Controller.Api;

import leyans.RidersHub.DTO.StopPointDTO;
import leyans.RidersHub.Service.MapService.MapBox.MapboxService;
import leyans.RidersHub.Service.RidesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/location")
public class MapboxController {
    private final MapboxService mapboxService;

    private final RidesService ridesService;

    @Autowired
    public MapboxController(MapboxService mapboxService, RidesService ridesService) {
        this.mapboxService = mapboxService;
        this.ridesService = ridesService;
    }

    @GetMapping("/staticImage")
    public ResponseEntity<String> getMapImage(@RequestParam double lon, @RequestParam double lat) {
        String cachedImageUrl = mapboxService.checkCachedMapImage(lon, lat);

        if (cachedImageUrl != null) {
            return ResponseEntity.ok(cachedImageUrl);
        }

        String imageUrl = mapboxService.getStaticMapImageUrl(lon, lat);
        return ResponseEntity.ok(imageUrl);
    }

    @GetMapping("/directions")
    public ResponseEntity<String> getDirections(
            @RequestParam double startLon, @RequestParam double startLat,
            @RequestParam double endLon, @RequestParam double endLat,
            @RequestParam(required = false) List<String> stops) {

        // Convert string coordinates to StopPointDTO objects
        List<StopPointDTO> stopPoints = null;
        if (stops != null && !stops.isEmpty()) {
            stopPoints = stops.stream()
                    .map(coord -> {
                        String[] parts = coord.split(",");
                        if (parts.length >= 2) {
                            try {
                                return new StopPointDTO(
                                        null, // stopName is not needed for directions
                                        Double.parseDouble(parts[0]), // longitude
                                        Double.parseDouble(parts[1])  // latitude
                                );
                            } catch (NumberFormatException e) {
                                return null;
                            }
                        }
                        return null;
                    })
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());
        }

        String routeCoordinates = ridesService.getRouteDirections(
                startLon, startLat, endLon, endLat, stopPoints);

        return ResponseEntity.ok(routeCoordinates);
    }

    // Update to support both GET and POST methods
    @PostMapping("/route-directions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> getRouteDirections(
            @RequestParam double startLon,
            @RequestParam double startLat,
            @RequestParam double endLon,
            @RequestParam double endLat,
            @RequestBody(required = false) List<StopPointDTO> stopPoints) {

        try {
            String routeCoordinates = ridesService.getRouteDirections(
                    startLon, startLat, endLon, endLat, stopPoints);

            return ResponseEntity.ok(routeCoordinates);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching route: " + e.getMessage());
        }
    }




}