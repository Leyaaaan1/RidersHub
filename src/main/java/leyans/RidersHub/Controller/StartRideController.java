package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.Response.LocationUpdateResponseDTO;
import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Service.RideLocationService;
import leyans.RidersHub.Service.StartRideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rides")
public class StartRideController {

    private final StartRideService startRideService;
    private final RideLocationService rideLocationService;

    @Autowired
    public StartRideController(StartRideService startRideService, RideLocationService rideLocationService) {
        this.startRideService = startRideService;
        this.rideLocationService = rideLocationService;
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<StartRideResponseDTO> startRide(@PathVariable("id") Integer id) {
        StartRideResponseDTO started = startRideService.startRide(id);
        System.out.println("Started ride with ID: " + started.getParticipants() + " participants");
        return ResponseEntity.ok(started);
    }




    @PostMapping("/{id}/riderName")
    public ResponseEntity<LocationUpdateResponseDTO> updateLocation(
            @PathVariable("id") Integer rideId,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude) {
        LocationUpdateResponseDTO response = rideLocationService.updateLocation(
                rideId, latitude, longitude);
        return ResponseEntity.ok(response);
    }
}
