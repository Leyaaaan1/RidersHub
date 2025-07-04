package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Service.RideLocationService;
import leyans.RidersHub.Service.StartRideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/start")
public class StartRideController {

    private final StartRideService startRideService;

    public StartRideController(StartRideService startRideService) {
        this.startRideService = startRideService;
    }

    @PostMapping("/{generatedRidesId}")
    public ResponseEntity<StartRideResponseDTO> startRide(@PathVariable Integer generatedRidesId) {
        try {
            StartRideResponseDTO response = startRideService.startRide(generatedRidesId);

            return ResponseEntity.ok(response);
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RideResponseDTO>> getCurrentStartedRides() {
        try {
            List<RideResponseDTO> rides = startRideService.getCurrentStartedRides();
            return ResponseEntity.ok(rides);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
    }



}



