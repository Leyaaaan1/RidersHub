package leyans.RidersHub.Controller;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import leyans.RidersHub.DTO.*;
import leyans.RidersHub.DTO.Response.LocationResponseDTO;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Service.RiderService;
import leyans.RidersHub.Service.RidesService;
import leyans.RidersHub.Service.StartRideService;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/riders")
public class RiderController {

    private final RiderService riderService;
    private final RidesService ridesService;


    @Autowired
    public RiderController(RiderService riderService, RidesService ridesService) {
        this.riderService = riderService;
        this.ridesService = ridesService;
    }

    @PostMapping("/rider-type")
    public ResponseEntity<RiderType> addRiderType(@RequestBody RiderTypeRequest request) {
        RiderType riderType = riderService.addRiderType(request.getRiderType());
        return ResponseEntity.ok(riderType);
    }

    @GetMapping("/current-rider-type")
    public ResponseEntity<RiderType> getCurrentUserRiderType() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        RiderType riderType = riderService.getCurrentUserRiderType(username);
        return ResponseEntity.ok(riderType);
    }


    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RideResponseDTO> createRide(@RequestBody RideRequestDTO rideRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        RideResponseDTO response = ridesService.createRide(
                rideRequest.getGeneratedRidesId(),
                username,
                rideRequest.getRidesName(),
                rideRequest.getLocationName(),
                rideRequest.getRiderType(),
                rideRequest.getDistance(),
                rideRequest.getDate(),
                rideRequest.getParticipants(),
                rideRequest.getDescription(),
                rideRequest.getLatitude(),
                rideRequest.getLongitude(),
                rideRequest.getStartLat(),
                rideRequest.getStartLng(),
                rideRequest.getEndLat(),
                rideRequest.getEndLng(),
                rideRequest.getMapImageUrl(),
                rideRequest.getMagImageStartingLocation(),
                rideRequest.getMagImageEndingLocation()
        );
        System.out.println("Authenticated username: " + username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchRiders(@RequestParam(value = "username", required = false) String searchTerm) {

        String searchUsername = searchTerm != null ? searchTerm : "None";
        List<String> usernames = riderService.findUsernamesContaining(searchUsername);
        return ResponseEntity.ok(usernames);
    }


    @GetMapping("/{generatedRidesId}/map-image")
    public ResponseEntity<String> getRideMapImage(@PathVariable Integer generatedRidesId) {
        try {
            String mapImageUrl = ridesService.getRideMapImageUrlById(generatedRidesId);
            return ResponseEntity.ok(mapImageUrl);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving map image: " + e.getMessage());
        }
    }

    @GetMapping("/{generatedRidesId}")
    public ResponseEntity<?> getRideDetailsByGeneratedId(@PathVariable Integer generatedRidesId) {
        try {
            RideResponseDTO ride = ridesService.findRideByGeneratedId(generatedRidesId);
            return ResponseEntity.ok(ride);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ride not found: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving ride details: " + e.getMessage());
        }
    }

    @GetMapping("/rides")
    public Page<RideResponseDTO> getRides(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ridesService.getRidesWithPagination(page, size);
    }

}
