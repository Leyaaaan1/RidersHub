package leyans.RidersHub.Controller;
import leyans.RidersHub.DTO.*;
import leyans.RidersHub.DTO.Response.LocationResponseDTO;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Service.RiderService;
import leyans.RidersHub.Service.RidesService;
import leyans.RidersHub.Service.StartRideService;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/riders")
public class RiderController {

    private final RiderService riderService;
    private final RidesService ridesService;


    @Autowired
    public RiderController(RiderService riderService, RidesService ridesService) {
        this.riderService = riderService;
        this.ridesService = ridesService;
    }

    @PostMapping("/rider-type")
    public ResponseEntity<RiderType> addRiderType(@RequestBody RiderTypeRequest request) {
        RiderType riderType = riderService.addRiderType(request.getRiderType());
        return ResponseEntity.ok(riderType);
    }

    @GetMapping("/current-rider-type")
    public ResponseEntity<RiderType> getCurrentUserRiderType() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        RiderType riderType = riderService.getCurrentUserRiderType(username);
        return ResponseEntity.ok(riderType);
    }




    @GetMapping("/all")
    public ResponseEntity<List<Rider>> getAllRiders() {
        List<Rider> riders = riderService.getAllRiders();
        return ResponseEntity.ok(riders);
    }

    @PostMapping("/create")
    public ResponseEntity<RideResponseDTO> createRide(@RequestBody RideRequestDTO rideRequest) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        RideResponseDTO response = ridesService.createRide(
                username,
                rideRequest.getRidesName(),
                rideRequest.getLocationName(),
                rideRequest.getRiderType(),
                rideRequest.getDistance(),
                rideRequest.getStartingPoint(),
                rideRequest.getDate(),
                rideRequest.getLatitude(),
                rideRequest.getLongitude(),
                rideRequest.getEndingPoint(),
                rideRequest.getParticipants(),
                rideRequest.getDescription()

                );
        System.out.println("Authenticated username: " + username);

        return ResponseEntity.ok(response);
    }









}
