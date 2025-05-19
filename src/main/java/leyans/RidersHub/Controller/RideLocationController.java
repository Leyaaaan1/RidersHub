package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.NearbyRiderDTO;
import leyans.RidersHub.DTO.Response.LocationsResponseDTO;
import leyans.RidersHub.Service.RideLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides/location")
public class RideLocationController {

    private final RideLocationService rideLocationService;

    public RideLocationController(RideLocationService rideLocationService) {
        this.rideLocationService = rideLocationService;
    }

    @PostMapping("/start")
    public ResponseEntity<LocationsResponseDTO> startRide(
            @RequestParam String locationName,
            @RequestParam double latitude,
            @RequestParam double longitude) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        LocationsResponseDTO response = rideLocationService.startRide(username, locationName, latitude, longitude);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<LocationsResponseDTO> updateRideLocation(
            @RequestParam String rideId,
            @RequestParam double latitude,
            @RequestParam double longitude) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        LocationsResponseDTO response = rideLocationService.updateRideLocation(username, rideId, latitude, longitude);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/end")
    public ResponseEntity<LocationsResponseDTO> endRide(
            @RequestParam String rideId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        LocationsResponseDTO response = rideLocationService.endRide(username, rideId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyRiderDTO>> getNearbyRiders(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "1000") double radius) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        List<NearbyRiderDTO> nearbyRiders = rideLocationService.findNearbyRiders(
                username, latitude, longitude, radius);

        return ResponseEntity.ok(nearbyRiders);
    }

    @GetMapping("/distance")
    public ResponseEntity<Double> calculateDistance(
            @RequestParam double lat1,
            @RequestParam double lon1,
            @RequestParam double lat2,
            @RequestParam double lon2) {

        double distance = rideLocationService.calculateDistance(lat1, lon1, lat2, lon2);
        return ResponseEntity.ok(distance);
    }
}