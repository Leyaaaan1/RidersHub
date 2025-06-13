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
@RequestMapping("/rides")
public class StartRideController {

    private final StartRideService rideService;

    public StartRideController(StartRideService rideService) {
        this.rideService = rideService;
    }
    //use created ride id to start,
    @PostMapping("/{rideId}/start")
    public ResponseEntity<StartRideResponseDTO> startRide(@PathVariable Integer rideId) {
        try {
            StartRideResponseDTO response = rideService.startRide(rideId);
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

//    @GetMapping("/{rideId}/search")
//    public ResponseEntity<String> searchRide(@PathVariable Integer rideId) {
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        // This is just a placeholder for the actual search logic
//        // In a real application, you would implement the search logic here
//        return ResponseEntity.ok("Searching for ride with ID: " + rideId + " for user: " + username);
//    }
}

