package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.LocationRequest;
import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.Service.SampleLocationService;
import leyans.RidersHub.model.Location;
import leyans.RidersHub.model.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LocationController {


    @Autowired
    private SampleLocationService sampleLocationService;
    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    public LocationController(SampleLocationService sampleLocationService) {
        this.sampleLocationService = sampleLocationService;
    }



    @GetMapping("/locations")
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return ResponseEntity.ok(locations);
    }

    @PostMapping("/add-locatios")
    public ResponseEntity<Location> addRider (@RequestBody LocationRequest locationRequest) {

        Location locations = sampleLocationService.
    }


//    @PostMapping("/add")
//    public ResponseEntity<Location> addLocation(@RequestBody Location location) {
//        sampleLocationService.
//    }

}
