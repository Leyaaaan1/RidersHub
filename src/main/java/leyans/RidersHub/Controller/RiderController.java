package leyans.RidersHub.Controller;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Service.RiderService;
import leyans.RidersHub.model.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rider")
public class RiderController {

    @Autowired
    private RiderRepository riderRepository;
    @Autowired
    private RiderService riderService;


    public RiderController(RiderRepository riderRepository, RiderService riderService) {
        this.riderRepository = riderRepository;
        this.riderService = riderService;
    }

    @GetMapping("/all")
    public List<Rider> getAllRiders() {
        return riderService.getAllRiders();
    }

    @GetMapping("/{rider_id}")
    public Rider getRiderById(@PathVariable Integer rider_id) {
        Optional<Rider> rider = riderRepository.findById(rider_id);
        return rider.orElse(null);
    }



    @PostMapping("/add")
    public ResponseEntity<Rider> addRiders(@RequestBody Rider riderAdd) {
        try {
            Rider savedRider = riderService.addRider(riderAdd);
            return ResponseEntity.ok(savedRider);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Return bad request for invalid authorities
        }
    }



    @PostMapping("/update")
    public ResponseEntity<Rider> updateRider(@RequestBody Rider rider) {
        Rider updatedRider = riderService.updateRider(rider);
        return  ResponseEntity.ok(updatedRider);
    }


}
