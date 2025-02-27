package leyans.RidersHub.Controller;
import leyans.RidersHub.DTO.*;
import leyans.RidersHub.Service.LocationService;
import leyans.RidersHub.Service.RiderService;
import leyans.RidersHub.Service.RidesService;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/riders")
public class RiderController {

    private final RiderService riderService;
    private final RidesService ridesService;
    private final LocationService locationService;


    @Autowired
    public RiderController(RiderService riderService, RidesService ridesService, LocationService locationService) {
        this.riderService = riderService;
        this.ridesService = ridesService;
        this.locationService = locationService;
    }


    // add type of rider with the entities of rider type
    @PostMapping("/rider-type")
    public ResponseEntity<RiderType> addRiderType(@RequestBody RiderTypeRequest request) {
        RiderType riderType = riderService.addRiderType(request.getRiderType());
        return ResponseEntity.ok(riderType);
    }

    @PostMapping("/add")
    public ResponseEntity<Rider> addRider(@RequestBody RiderRequest request) {

        Rider rider = riderService.addRider(
                request.getUsername(),
                request.getPassword(),
                request.getEnabled(),
                request.getRiderType());
        return ResponseEntity.ok(rider);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Rider>> getAllRiders() {
        List<Rider> riders = riderService.getAllRiders();
        return ResponseEntity.ok(riders);
    }

    @PostMapping("/create-ride")
    public ResponseEntity<RideResponseDTO> createRide(@RequestBody RideRequestDTO rideRequest) {
        RideResponseDTO response = ridesService.createRide(
                rideRequest.getUsername(),
                rideRequest.getRidesName(),
                rideRequest.getLocationName(),
                rideRequest.getRiderType(),
                rideRequest.getDistance(),
                rideRequest.getStartingPoint(),
                rideRequest.getDate(),
                rideRequest.getLatitude(),
                rideRequest.getLongitude()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-locations")
    public ResponseEntity<LocationResponseDTO> createLocation(@RequestBody LocationRequest request) {
        LocationResponseDTO savedLocation = locationService.saveLocation(
                request.getUsername(),
                request.getLocationName(),
                request.getLatitude(),
                request.getLongitude()
        );
        return ResponseEntity.ok(savedLocation);
    }

    @PostMapping("/send")
    public String sendMessage(@RequestParam String riderType, @RequestParam String message) {
        riderService.sendMessage(riderType, message);
        return "Message sent to RiderType: " + riderType;
    }


}
