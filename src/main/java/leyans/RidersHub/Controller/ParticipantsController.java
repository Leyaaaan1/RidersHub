package leyans.RidersHub.Controller;

import leyans.RidersHub.Config.Security.SecurityUtils;
import leyans.RidersHub.Service.RideParticipantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ParticipantsController {


    private final RideParticipantService rideParticipantService;

    public ParticipantsController(RideParticipantService rideParticipantService) {
        this.rideParticipantService = rideParticipantService;
    }

    @PostMapping("/{rideId}/participants/{username}")
    public ResponseEntity<?> addParticipant(@PathVariable("rideId") Integer generatedRidesId,
                                            @PathVariable("username") String username) {
        try {
            ResponseEntity<?> authResponse = SecurityUtils.validateAuthentication();
            if (authResponse != null) {
                return authResponse;
            }

            rideParticipantService.addParticipantToRide(generatedRidesId, username);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding participant: " + e.getMessage());
        }
    }

    @DeleteMapping("/{rideId}/participants/{username}")
    public ResponseEntity<?> removeParticipant(@PathVariable("rideId") Integer generatedRidesId,
                                               @PathVariable("username") String username) {
        try {
            ResponseEntity<?> authResponse = SecurityUtils.validateAuthentication();
            if (authResponse != null) {
                return authResponse;
            }

            rideParticipantService.removeParticipantFromRide(generatedRidesId, username);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error removing participant: " + e.getMessage());
        }
    }




    @GetMapping("/test/auth")
    public ResponseEntity<String> testAuth() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok("Authenticated as: " + username);
    }
}
