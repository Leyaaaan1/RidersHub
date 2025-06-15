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
@RequestMapping("/ready")
public class StartRideController {

    private final StartRideService rideService;

    public StartRideController(StartRideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping("/{generatedRidesId}/start")
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


}

