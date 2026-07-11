
package leyans.RidersHub.Controller.Rides;

import leyans.RidersHub.DTO.Response.Rides.ActiveRideDTO;
import leyans.RidersHub.DTO.Response.Rides.StartRideResponseDTO;
import leyans.RidersHub.ExceptionHandler.RideAuthorizationException;
import leyans.RidersHub.Service.Rides.StartRideService;
import leyans.RidersHub.Utility.Rides.StartedUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/start")
public class StartRideController {

    private final StartRideService startRideService;
    private final StartedUtil startedUtil;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(StartRideController.class);


    public StartRideController(StartRideService startRideService, StartedUtil startedUtil) {
        this.startRideService = startRideService;
        this.startedUtil = startedUtil;
    }


    @PostMapping("/{generatedRidesId}")
    public ResponseEntity<StartRideResponseDTO> startRide(@PathVariable String generatedRidesId) {
        try {
            StartRideResponseDTO response = startRideService.startRide(generatedRidesId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (Exception ex) {
            // Log the FULL stack trace so you can see the real cause
            log.error("[startRide] Unexpected error for rideId={}", generatedRidesId, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<ActiveRideDTO> getActiveRide() {
        try {
            ActiveRideDTO rideDetails = startedUtil.getStartedRideDetails();
            return ResponseEntity.ok(rideDetails);
        } catch (IllegalArgumentException ex) {
            // ✅ Removed AccessDeniedException — now handled by GlobalExceptionHandler
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/update/{generatedRidesId}")
    public ResponseEntity<Void> updateRide(@PathVariable String generatedRidesId) {
        try {
            startRideService.deactivateRide(generatedRidesId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/leave/{generatedRidesId}")
    public ResponseEntity<Void> leaveRide(@PathVariable String generatedRidesId) {
        try {
            startRideService.leaveRide(generatedRidesId);
            return ResponseEntity.ok().build();
        } catch (RideAuthorizationException ex) {
            // Creator tried to leave — must stop the ride instead
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/leave-pre-start/{generatedRidesId}")
    public ResponseEntity<Void> leaveRidePreStart(@PathVariable String generatedRidesId) {
        try {
            startRideService.leaveRidePreStart(generatedRidesId);
            return ResponseEntity.ok().build();
        } catch (RideAuthorizationException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}