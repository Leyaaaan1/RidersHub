package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.LocationRequest;
import leyans.RidersHub.DTO.RiderTypeRequest;
import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.Service.SampleLocationService;
import leyans.RidersHub.model.Location;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
public class LocationController {


    @Autowired
    private SampleLocationService sampleLocationService;
    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    public LocationController(SampleLocationService sampleLocationService) {
        this.sampleLocationService = sampleLocationService;
    }

    @GetMapping("/alllocations")
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return ResponseEntity.ok(locations);
    }


    @PostMapping("/addlocation")
    public ResponseEntity<Location> addLocation(@RequestBody LocationRequest locationRequest) {
        Location newLocation = sampleLocationService.addLocation(locationRequest.getLocation());
        return ResponseEntity.ok(newLocation);
    }

}
