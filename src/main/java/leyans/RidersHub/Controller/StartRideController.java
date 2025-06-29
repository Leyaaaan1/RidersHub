package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Service.RideLocationService;
import leyans.RidersHub.Service.StartRideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/start")
public class StartRideController {

    private final StartRideService rideService;

    public StartRideController(StartRideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping("/{generatedRidesId}")
    public ResponseEntity<StartRideResponseDTO> startRide(@PathVariable Integer generatedRidesId) {
        try {
            StartRideResponseDTO response = rideService.startRide(generatedRidesId);

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


    @GetMapping("/view/{generatedRidesId}")
    public ResponseEntity<?> getStartedRide(@PathVariable Integer generatedRidesId) {
        try {
            StartRideResponseDTO responseDTO = rideService.getStartedRideByRideId(generatedRidesId);
            return ResponseEntity.ok(responseDTO);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body("Access Denied: " + e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(404).body("Ride not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }






}



