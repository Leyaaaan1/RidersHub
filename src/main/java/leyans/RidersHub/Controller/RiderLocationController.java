package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.Service.RideLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/locations")
public class RiderLocationController {

    @Autowired
    private RideLocationService rideLocationService;


//    @PostMapping("/update")
//    public ResponseEntity<LocationUpdateResponseDTO> updateLocation(
//            @RequestParam double latitude,
//            @RequestParam double longitude) {
//
//        try {
//            leyans.RidersHub.DTO.Response.LocationUpdateResponseDTO response =
//                    rideLocationService.updateLocation(rideId, latitude, longitude);
//
//            // Set the additional fields in the response
//            response.setRideId(rideId);
//            response.setLatitude(latitude);
//            response.setLongitude(longitude);
//
//            return ResponseEntity.ok(response);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }

    @PostMapping("/update/{rideId}")
    public ResponseEntity<LocationUpdateRequestDTO> updateParticipantLocation(
            @PathVariable Integer rideId,
            @RequestBody Map<String, Double> coordinates) {

        double latitude = coordinates.get("latitude");
        double longitude = coordinates.get("longitude");

        // This already updates the authenticated user's location
        LocationUpdateRequestDTO response = rideLocationService.updateLocation(rideId, latitude, longitude);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rider/{username}")
    public ResponseEntity<LocationUpdateRequestDTO> getRiderLocation(@PathVariable String username) {
        LocationUpdateRequestDTO location = rideLocationService.getRiderLocation(username);
        return ResponseEntity.ok(location);
    }
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





