package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.Service.RideLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/update")
public class RiderLocationController {

    @Autowired
    private RideLocationService rideLocationService;


    @PostMapping("/{generatedRidesId}")
    public ResponseEntity<?> updateParticipantLocation(
            @PathVariable Integer generatedRidesId,
            @RequestBody Map<String, Double> coordinates) {

        try {
            double latitude = coordinates.get("latitude");
            double longitude = coordinates.get("longitude");

            LocationUpdateRequestDTO response =
                    rideLocationService.updateLocation(generatedRidesId, latitude, longitude);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating location: " + e.getMessage());
        }
    }


    //use started ride id to update,
//    @PostMapping("/update/{generatedRidesId}")
//    public ResponseEntity<LocationUpdateRequestDTO> updateParticipantLocation(
//            @PathVariable Integer generatedRidesId,
//            @RequestBody Map<String, Double> coordinates) {
//
//        double latitude = coordinates.get("latitude");
//        double longitude = coordinates.get("longitude");
//
//        // This already updates the authenticated user's location
//        LocationUpdateRequestDTO response = rideLocationService.updateLocation(generatedRidesId, latitude, longitude);
//        return ResponseEntity.ok(response);
//    }
//
//
//    @GetMapping("/test/auth")
//    public ResponseEntity<String> testAuth() {
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        return ResponseEntity.ok("Authenticated as: " + username);
//    }

//    @GetMapping("/rider/{username}")
//    public ResponseEntity<LocationUpdateRequestDTO> getRiderLocation(@PathVariable String username) {
//        LocationUpdateRequestDTO location = rideLocationService.getRiderLocation(username);
//        return ResponseEntity.ok(location);
//    }
}

   /* @PostMapping("/update/{rideId}/{username}")
    public ResponseEntity<LocationUpdateRequestDTO> updateLocation(
            @PathVariable Integer rideId,
            @PathVariable String username,
            @RequestBody Map<String, Double> coordinates) {

        double latitude = coordinates.get("latitude");
        double longitude = coordinates.get("longitude");

        LocationUpdateRequestDTO response = rideLocationService.updateLocation(rideId, username, latitude, longitude);
*/


//        @GetMapping("/rider/{rideId}")





