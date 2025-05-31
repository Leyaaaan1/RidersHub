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
}

//    @GetMapping("/{rideId}/participants/locations")
//    public ResponseEntity<List<ParticipantLocationDTO>> getParticipantLocations(@PathVariable("rideId") Integer rideId) {
//        List<ParticipantLocationDTO> locations = rideLocationService.getParticipantLocations(rideId);
//        return ResponseEntity.ok(locations);
//    }
//
//
//    @PostMapping("/{id}/riderName")
//    public ResponseEntity<LocationUpdateRequestDTO> updateLocation(
//            @PathVariable("id") Integer rideId,
//            @RequestParam("latitude") double latitude,
//            @RequestParam("longitude") double longitude) {
//        LocationUpdateRequestDTO response = rideLocationService.updateLocation(
//                rideId, latitude, longitude);
//        return ResponseEntity.ok(response);
//    }
//}
